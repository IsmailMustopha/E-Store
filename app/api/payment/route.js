import connectDB from "@/lib/databaseConnection";
import OrderModel from "@/models/Order.model";
import { response } from "@/lib/helperFunction";
import axios from "axios";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();
    const {
      userId,
      formData,
      products,
      totalAmount,
      subtotal,
      discount,
      couponDiscountAmount,
    } = payload;

    const tx_ref = `tx-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    const newOrder = await OrderModel.create({
      user: userId || null,
      ...formData,
      products,
      subtotal,
      discount,
      couponDiscountAmount,
      totalAmount,
      order_id: tx_ref,
      payment_id: "pending",
      isPaid: false,
      status: "pending",
    });

    console.log("Order Created Successfully:", newOrder.order_id);

    const flwResponse = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: tx_ref,
        amount: totalAmount,
        currency: "NGN",
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify-payment`,
        customer: {
          email: formData.email,
          phone_number: formData.phone,
          name: formData.name,
        },
        customizations: {
          title: "E-store Checkout",
          description: `Payment for Order ${tx_ref}`,
          logo: "https://res.cloudinary.com/dg7efdu9o/image/upload/v1750052410/logo-black_mb1rve.webp",
        },
        meta: { orderId: newOrder._id.toString() },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      },
    );

    if (flwResponse.data.status === "success") {
      return Response.json(
        { url: flwResponse.data.data.link },
        { status: 200 },
      );
    } else {
      return response(false, 400, "Flutterwave error");
    }
  } catch (error) {
    console.error("Payment Error:", error.response?.data || error.message);
    return response(false, 500, "Internal Server Error");
  }
}
