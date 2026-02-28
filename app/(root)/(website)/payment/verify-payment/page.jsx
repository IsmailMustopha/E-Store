"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/reducer/cartReducer";
import { WEBSITE_ORDER_DETAILS } from "@/app/routes/WebsitePanelRoute";

const VerifyPaymentPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const transaction_id = searchParams.get("transaction_id");
  const tx_ref = searchParams.get("tx_ref");
  const flw_status = searchParams.get("status");

  const hasCalled = useRef(false);

  useEffect(() => {
    if (!transaction_id || !tx_ref || hasCalled.current) return;

    const verify = async () => {
      hasCalled.current = true;
      try {
        const { data } = await axios.get(`/api/payment/verify-payment`, {
          params: { transaction_id, tx_ref, status: flw_status },
        });

        if (data.success) {
          setStatus("success");
          dispatch(clearCart());

          setTimeout(() => {
            router.push(WEBSITE_ORDER_DETAILS(tx_ref));
          }, 3000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Verification Error:", error);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [transaction_id, tx_ref, flw_status, router, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      {loading ? (
        <div className="space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-orange-500 mx-auto" />
          <h2 className="text-2xl font-bold">Verifying Your Payment...</h2>
          <p className="text-gray-500">
            Please do not close or refresh this page.
          </p>
        </div>
      ) : status === "success" ? (
        <div className="space-y-4">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          <h2 className="text-3xl font-bold text-green-600">
            Payment Confirmed!
          </h2>
          <p className="text-gray-600">
            Your order has been placed successfully.
          </p>
          <p className="text-sm text-gray-400 font-mono">Ref: {tx_ref}</p>
          <p className="animate-pulse text-orange-500 mt-4">
            Redirecting you to order details...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <XCircle className="w-20 h-20 text-red-500 mx-auto" />
          <h2 className="text-3xl font-bold text-red-600">
            Verification Failed
          </h2>
          <p className="text-gray-600">
            We couldn't verify your payment. If you were debited, please contact
            support.
          </p>
          <button
            onClick={() => router.push("/checkout")}
            className="mt-6 px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            Back to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyPaymentPage;
