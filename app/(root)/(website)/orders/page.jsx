"use client";
import { WEBSITE_ORDER_DETAILS } from "@/app/routes/WebsitePanelRoute";
import Loading from "@/components/Application/Loading";
import UserPanelLayout from "@/components/Website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/Website/WebsiteBreadcrumb";
import useFetch from "@/hooks/useFetch";
import Link from "next/link";
import React from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const breadCrumbData = {
  title: "Orders",
  links: [{ label: "Orders" }],
};

const Orders = () => {
  const { data: orderData, loading } = useFetch("/api/user-order");
  console.log("order", orderData);
  if (loading) return <Loading />;

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />
      <UserPanelLayout>
        <div className="shadow rounded">
          <div className="p-5 text-xl font-semibold border">Orders</div>
          {loading ? (
            <div className="text-center py-5">Loading....</div>
          ) : (
            <div className="p-5">
              <h4 className="text-lg font-semiabold mb-3">Recent Orders</h4>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Sr.No.
                      </th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Order id
                      </th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Total Item
                      </th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData &&
                      orderData?.data?.map((order, i) => (
                        <tr key={order._id}>
                          <td className="text-start text-sm text-gray-500 p-2 font-bold">
                            {i + 1}
                          </td>
                          <td className="text-start text-sm text-gray-500 p-2">
                            <Link
                              className="underline hover:text-blue-500"
                              href={WEBSITE_ORDER_DETAILS(order.order_id)}
                            >
                              {order.order_id}
                            </Link>
                          </td>
                          <td className="text-start text-sm text-gray-500 p-2">
                            {order.products.length}
                          </td>
                          <td className="text-start text-sm text-gray-500 p-2">
                            {order.totalAmount.toLocaleString("en-In", {
                              style: "currency",
                              currency: "NGN",
                            })}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default Orders;
