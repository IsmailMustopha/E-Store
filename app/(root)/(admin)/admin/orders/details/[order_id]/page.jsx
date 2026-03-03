"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import axios from "axios";

// Components
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ButtonLoading from "@/components/Application/ButtonLoading";

// Hooks & Constants
import useFetch from "@/hooks/useFetch";
import placeholderImg from "@/public/assets/images/img-placeholder.webp";
import { WEBSITE_PRODUCT_DETAILS } from "@/app/routes/WebsitePanelRoute";
import {
  ADMIN_DASHBOARD,
  ADMIN_ORDER_SHOW,
} from "@/app/routes/AdminPanelRoute";
import { showToast } from "@/lib/showToast";

const BREADCRUMB_DATA = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_ORDER_SHOW, label: "Orders" },
  { href: "", label: "Order Details" },
];

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Unverified", value: "unverified" },
];

// Helper for currency formatting
const formatCurrency = (amount = 0) =>
  amount.toLocaleString("en-NG", { style: "currency", currency: "NGN" });

const OrderDetails = ({ params }) => {
  const { order_id } = use(params);
  const [orderData, setOrderData] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { data, loading } = useFetch(`/api/orders/get/${order_id}`);

  useEffect(() => {
    if (data?.success) {
      setOrderData(data.data);
      setOrderStatus(data.data?.status);
    }
  }, [data]);

  const handleOrderStatus = async () => {
    setUpdatingStatus(true);
    try {
      const { data: response } = await axios.put("/api/orders/update-status", {
        _id: orderData?._id,
        status: orderStatus,
      });

      if (!response.success) throw new Error(response.message);
      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading)
    return (
      <div className="py-32 text-center text-gray-500">
        Loading order details...
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <BreadCrumb breadcrumbData={BREADCRUMB_DATA} />

      <div className="lg:px-32 px-5 my-20">
        {!orderData ? (
          <NotFoundState />
        ) : (
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Header Info Grid */}
            <div className="grid md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-xl">
              <OrderInfoSection order={orderData} />
              <ShippingSection order={orderData} />
            </div>

            {/* Products Table */}
            <ProductTable products={orderData.products} />

            {/* Financials & Status Update */}
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <StatusUpdateSection
                status={orderStatus}
                setStatus={setOrderStatus}
                onSave={handleOrderStatus}
                loading={updatingStatus}
              />
              <FinancialSummary order={orderData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const NotFoundState = () => (
  <div className="flex flex-col justify-center items-center py-32">
    <h4 className="text-red-500 text-2xl font-bold mb-2">Order Not Found</h4>
    <p className="text-gray-500">The order reference ID might be invalid.</p>
  </div>
);

const OrderInfoSection = ({ order }) => (
  <div>
    <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
      Order Information
    </h2>
    <div className="space-y-2 text-sm">
      <p>
        <b>Order ID:</b>{" "}
        <span className="font-mono text-blue-600">{order?.order_id}</span>
      </p>
      <p>
        <b>Payment Ref:</b> {order?.payment_id || "N/A"}
      </p>
      <p className="flex items-center gap-2">
        <b>Status:</b>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            order?.isPaid
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order?.status} {order?.isPaid ? "(Paid)" : "(Unpaid)"}
        </span>
      </p>
    </div>
  </div>
);

const ShippingSection = ({ order }) => (
  <div>
    <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
      Shipping Details
    </h2>
    <div className="space-y-1 text-sm text-gray-700">
      <p className="font-bold">{order?.name}</p>
      <p>{order?.email}</p>
      <p>{order?.phone}</p>
      <p>
        {order?.city}, {order?.state}, {order?.pincode}
      </p>
      <p>{order?.country}</p>
    </div>
  </div>
);

const ProductTable = ({ products = [] }) => (
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
        {products.map((product, index) => (
          <tr key={index} className="hover:bg-gray-50 transition">
            <td className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <Image
                    src={
                      product?.variantId?.media?.[0]?.secure_url ||
                      placeholderImg
                    }
                    fill
                    alt={product.name}
                    className="rounded object-cover border"
                  />
                </div>
                <div>
                  <Link
                    href={WEBSITE_PRODUCT_DETAILS(product?.productId?.slug)}
                    className="font-bold text-gray-900 hover:text-blue-600 line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {product?.variantId?.color || "N/A"} /{" "}
                    {product?.variantId?.size || "N/A"}
                  </p>
                </div>
              </div>
            </td>
            <td className="p-4 text-center">
              {formatCurrency(product.sellingPrice)}
            </td>
            <td className="p-4 text-center font-medium">{product.qty}</td>
            <td className="p-4 text-right font-bold">
              {formatCurrency(product.qty * product.sellingPrice)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StatusUpdateSection = ({ status, setStatus, onSave, loading }) => (
  <div className="p-6 bg-white border rounded-xl shadow-sm">
    <h4 className="text-lg font-semibold mb-4 text-gray-800">
      Update Order Status
    </h4>
    <Select onValueChange={setStatus} value={status}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {/* <Select
      options={STATUS_OPTIONS}
      selected={status}
      setSelected={setStatus}
      placeholder="Select status"
      isMulti={false}
    /> */}
    <ButtonLoading
      loading={loading}
      type="button"
      onClick={onSave}
      text="Save Status"
      className="mt-5 w-full md:w-auto"
    />
  </div>
);

const FinancialSummary = ({ order }) => (
  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
    <div className="flex justify-between text-gray-600 text-sm">
      <span>Subtotal:</span>
      <span>{formatCurrency(order?.subtotal)}</span>
    </div>
    <div className="flex justify-between text-red-500 text-sm">
      <span>Discount:</span>
      <span>- {formatCurrency(order?.discount)}</span>
    </div>
    {order?.couponDiscountAmount > 0 && (
      <div className="flex justify-between text-green-600 text-sm">
        <span>Coupon:</span>
        <span>- {formatCurrency(order?.couponDiscountAmount)}</span>
      </div>
    )}
    <div className="flex justify-between text-xl font-black border-t pt-3 text-gray-900">
      <span>Total:</span>
      <span className="text-blue-700">
        {formatCurrency(order?.totalAmount)}
      </span>
    </div>
  </div>
);

export default OrderDetails;

// "use client";
// import Image from "next/image";
// import placeholderImg from "@/public/assets/images/img-placeholder.webp";
// import Link from "next/link";
// import useFetch from "@/hooks/useFetch";
// import { use, useEffect, useState } from "react";
// import { WEBSITE_PRODUCT_DETAILS } from "@/app/routes/WebsitePanelRoute";
// import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
// import {
//   ADMIN_DASHBOARD,
//   ADMIN_ORDER_SHOW,
// } from "@/app/routes/AdminPanelRoute";
// import { Select } from "@/components/ui/select";
// import ButtonLoading from "@/components/Application/ButtonLoading";
// import { showToast } from "@/lib/showToast";
// import axios from "axios";

// const breadcrumbData = [
//   { href: ADMIN_DASHBOARD, label: "Home" },
//   { href: ADMIN_ORDER_SHOW, label: "Orders" },
//   { href: "", label: "Order Details" },
// ];

// const OrderDetails = ({ params }) => {
//   const { order_id } = use(params);
//   const [orderData, setOrderData] = useState();
//   const [orderStatus, setOrderStatus] = useState();
//   const [updatingStatus, setUpdatingStatus] = useState(false);
//   const { data, loading } = useFetch(`/api/orders/get/${order_id}`);
//   console.log(data);
//   console.log(orderData);

//   useEffect(() => {
//     if (data && data.success) {
//       setOrderData(data.data);
//       setOrderStatus(data.data?.status);
//     }
//   }, [data]);

//   const statusOptions = [
//     { label: "Pending", value: "pending" },
//     { label: "Processing", value: "processing" },
//     { label: "Shipped", value: "shipped" },
//     { label: "Delivered", value: "delivered" },
//     { label: "Cancelled", value: "cancelled" },
//     { label: "Unverified", value: "unverified" },
//   ];

//   const handleOrderStatus = async () => {
//     setUpdatingStatus(true);
//     try {
//       const { data: response } = await axios.put("/api/orders/update-status", {
//         _id: orderData?._id,
//         status: orderStatus,
//       });

//       if (!response.success) {
//         throw new Error(response.message);
//       }

//       showToast("success", response.message);
//     } catch (error) {
//       showToast("error", error.message);
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <BreadCrumb breadcrumbData={breadcrumbData} />

//       <div className="lg:px-32 px-5 my-20">
//         {!orderData ? (
//           <div className="flex flex-col justify-center items-center py-32">
//             <h4 className="text-red-500 text-2xl font-bold mb-2">
//               Order Not Found
//             </h4>
//             <p className="text-gray-500">
//               The order reference ID might be invalid.
//             </p>
//           </div>
//         ) : (
//           <div className="max-w-6xl mx-auto">
//             <div className="grid md:grid-cols-2 gap-8 mb-10 p-6 bg-gray-50 rounded-xl">
//               <div>
//                 <h2 className="text-xl font-bold mb-4 border-b pb-2">
//                   Order Information
//                 </h2>
//                 <div className="space-y-2">
//                   <p>
//                     <b>Order ID:</b>{" "}
//                     <span className="font-mono text-blue-600">
//                       {orderData?.order_id}
//                     </span>
//                   </p>
//                   <p>
//                     <b>Payment Ref:</b> {orderData?.payment_id || "N/A"}
//                   </p>
//                   <p className="flex items-center gap-2">
//                     <b>Status:</b>
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
//                         orderData?.isPaid
//                           ? "bg-green-100 text-green-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {orderData?.status}{" "}
//                       {orderData?.isPaid ? "(Paid)" : "(Unpaid)"}
//                     </span>
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <h2 className="text-xl font-bold mb-4 border-b pb-2">
//                   Shipping Details
//                 </h2>
//                 <div className="space-y-1 text-gray-700">
//                   <p className="font-bold">{orderData?.name}</p>
//                   <p>{orderData?.email}</p>
//                   <p>{orderData?.phone}</p>
//                   <p>
//                     {orderData?.city}, {orderData?.state}, {orderData?.pincode}
//                   </p>
//                   <p>{orderData?.country}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Products Table */}
//             <div className="overflow-x-auto shadow-sm rounded-lg border">
//               <table className="w-full text-sm text-left">
//                 <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold">
//                   <tr>
//                     <th className="p-4">Product</th>
//                     <th className="p-4 text-center">Price</th>
//                     <th className="p-4 text-center">Qty</th>
//                     <th className="p-4 text-right">Subtotal</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {orderData?.products?.map((product, index) => {
//                     // Extract image from populated media array
//                     const productImage =
//                       product?.variantId?.media?.[0]?.secure_url ||
//                       placeholderImg;

//                     return (
//                       <tr key={index} className="hover:bg-gray-50 transition">
//                         <td className="p-4">
//                           <div className="flex items-center gap-4">
//                             <div className="relative w-16 h-16 flex-shrink-0">
//                               <Image
//                                 src={productImage}
//                                 fill
//                                 alt={product.name}
//                                 className="rounded object-cover border"
//                               />
//                             </div>
//                             <div>
//                               <Link
//                                 href={WEBSITE_PRODUCT_DETAILS(
//                                   product?.productId?.slug,
//                                 )}
//                                 className="font-bold text-gray-900 hover:text-blue-600 line-clamp-1"
//                               >
//                                 {product.name}
//                               </Link>
//                               <p className="text-xs text-gray-500">
//                                 Variant: {product?.variantId?.color || "N/A"} /{" "}
//                                 {product?.variantId?.size || "N/A"}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-4 text-center">
//                           {product.sellingPrice.toLocaleString("en-NG", {
//                             style: "currency",
//                             currency: "NGN",
//                           })}
//                         </td>
//                         <td className="p-4 text-center font-medium">
//                           {product.qty}
//                         </td>
//                         <td className="p-4 text-right font-bold">
//                           {(product.qty * product.sellingPrice).toLocaleString(
//                             "en-NG",
//                             {
//                               style: "currency",
//                               currency: "NGN",
//                             },
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Financial Summary */}
//             <div className="mt-8 flex justify-end">
//               <div className="w-full md:w-64 space-y-3">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Subtotal:</span>
//                   <span>
//                     {orderData?.subtotal?.toLocaleString("en-NG", {
//                       style: "currency",
//                       currency: "NGN",
//                     })}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-red-500">
//                   <span>Discount:</span>
//                   <span>
//                     -
//                     {orderData?.discount?.toLocaleString("en-NG", {
//                       style: "currency",
//                       currency: "NGN",
//                     })}
//                   </span>
//                 </div>
//                 {orderData?.couponDiscountAmount > 0 && (
//                   <div className="flex justify-between text-green-600">
//                     <span>Coupon:</span>
//                     <span>
//                       -
//                       {orderData?.couponDiscountAmount?.toLocaleString(
//                         "en-NG",
//                         {
//                           style: "currency",
//                           currency: "NGN",
//                         },
//                       )}
//                     </span>
//                   </div>
//                 )}
//                 <div className="flex justify-between text-xl font-black border-t pt-3">
//                   <span>Total:</span>
//                   <span className="text-blue-700">
//                     {orderData?.totalAmount?.toLocaleString("en-NG", {
//                       style: "currency",
//                       currency: "NGN",
//                     })}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <hr />
//             <div className="p-6 bg-white border rounded-xl shadow-sm">
//               <h4 className="text-lg font-semibold mb-4 text-gray-800">
//                 Update Order Status
//               </h4>
//               <Select
//                 options={statusOptions}
//                 selected={orderStatus}
//                 setSelected={(value) => setOrderStatus(value)}
//                 placeholder="Select"
//                 isMulti={false}
//               />
//               <ButtonLoading
//                 loading={updatingStatus}
//                 type="button"
//                 onClick={handleOrderStatus}
//                 text="Save Status"
//                 className="mt-5 cursor-pointer"
//               />
//             </div>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;
