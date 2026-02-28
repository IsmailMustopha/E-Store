import connectDB from "@/lib/databaseConnection";
import OrderModel from "@/models/Order.model";
import { orderNotification } from "@/email/orderNotification";
import { sendMail } from "@/lib/sendMail";
import { response } from "@/lib/helperFunction";
import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const transaction_id = searchParams.get("transaction_id");
  const tx_ref = searchParams.get("tx_ref");
  const status = searchParams.get("status");

  // console.log("Verifying reference:", tx_ref);

  if (status !== "successful" && status !== "completed") {
    return response(false, 400, "Transaction failed at gateway");
  }

  try {
    await connectDB();

    const flwVerify = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      },
    );

    const verifiedData = flwVerify.data.data;

    if (verifiedData.status === "successful") {
      const updatedOrder = await OrderModel.findOneAndUpdate(
        { order_id: tx_ref },
        {
          isPaid: true,
          payment_id: String(transaction_id),
          status: "pending",
        },
        { new: true },
      );

      if (!updatedOrder) {
        console.error("Order not found in DB for ref:", tx_ref);
        return response(false, 404, "Order not found in database");
      }

      try {
        const mailData = {
          order_id: tx_ref,
          orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${tx_ref}`,
          name: updatedOrder.name,
        };

        await sendMail(
          "Order placed successfully.",
          updatedOrder.email,
          orderNotification(mailData),
        );
      } catch (emailError) {
        console.error("Email notification failed:", emailError.message);
      }

      return response(true, 200, "Order verified and email sent", {
        success: true,
      });
    }

    return response(false, 400, "Flutterwave verification failed");
  } catch (error) {
    console.error(
      "Internal Server Error:",
      error.response?.data || error.message,
    );
    return response(false, 500, "Internal Server Error");
  }
}
