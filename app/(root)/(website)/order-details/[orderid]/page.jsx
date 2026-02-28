import WebsiteBreadcrumb from "@/components/Website/WebsiteBreadcrumb";
import { WEBSITE_PRODUCT_DETAILS } from "@/app/routes/WebsitePanelRoute";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import placeholderImg from "@/public/assets/images/img-placeholder.webp";

const OrderDetails = async ({ params }) => {
  const { orderid } = await params;

  console.log("orderId", orderid)

  const { data: orderData } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/get/${orderid}`,
  );

  const breadcrumb = {
    title: "Order Details",
    links: [{ label: "Order Details" }],
  };

  const data = orderData?.data;

  return (
    <div className="min-h-screen bg-white">
      <WebsiteBreadcrumb props={breadcrumb} />

      <div className="lg:px-32 px-5 my-20">
        {!orderData?.success ? (
          <div className="flex flex-col justify-center items-center py-32">
            <h4 className="text-red-500 text-2xl font-bold mb-2">
              Order Not Found
            </h4>
            <p className="text-gray-500">
              The order reference ID might be invalid.
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Order Meta Information */}
            <div className="grid md:grid-cols-2 gap-8 mb-10 p-6 bg-gray-50 rounded-xl">
              <div>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">
                  Order Information
                </h2>
                <div className="space-y-2">
                  <p>
                    <b>Order ID:</b>{" "}
                    <span className="font-mono text-blue-600">
                      {data?.order_id}
                    </span>
                  </p>
                  <p>
                    <b>Payment Ref:</b> {data?.payment_id || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <b>Status:</b>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                        data?.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {data?.status} {data?.isPaid ? "(Paid)" : "(Unpaid)"}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">
                  Shipping Details
                </h2>
                <div className="space-y-1 text-gray-700">
                  <p className="font-bold">{data?.name}</p>
                  <p>{data?.email}</p>
                  <p>{data?.phone}</p>
                  <p>
                    {data?.city}, {data?.state}, {data?.pincode}
                  </p>
                  <p>{data?.country}</p>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto shadow-sm rounded-lg border">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4 text-center">Price</th>
                    <th className="p-4 text-center">Qty</th>
                    <th className="p-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data?.products?.map((product, index) => {
                    // Extract image from populated media array
                    const productImage =
                      product?.variantId?.media?.[0]?.secure_url || placeholderImg;

                    return (
                      <tr key={index} className="hover:bg-gray-50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={productImage}
                                fill
                                alt={product.name}
                                className="rounded object-cover border"
                              />
                            </div>
                            <div>
                              <Link
                                href={WEBSITE_PRODUCT_DETAILS(
                                  product?.productId?.slug,
                                )}
                                className="font-bold text-gray-900 hover:text-blue-600 line-clamp-1"
                              >
                                {product.name}
                              </Link>
                              <p className="text-xs text-gray-500">
                                Variant: {product?.variantId?.color || "N/A"} /{" "}
                                {product?.variantId?.size || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {product.sellingPrice.toLocaleString("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          })}
                        </td>
                        <td className="p-4 text-center font-medium">
                          {product.qty}
                        </td>
                        <td className="p-4 text-right font-bold">
                          {(product.qty * product.sellingPrice).toLocaleString(
                            "en-NG",
                            {
                              style: "currency",
                              currency: "NGN",
                            },
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="mt-8 flex justify-end">
              <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>
                    {data?.subtotal?.toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Discount:</span>
                  <span>
                    -
                    {data?.discount?.toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </span>
                </div>
                {data?.couponDiscountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon:</span>
                    <span>
                      -
                      {data?.couponDiscountAmount?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black border-t pt-3">
                  <span>Total:</span>
                  <span className="text-blue-700">
                    {data?.totalAmount?.toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
