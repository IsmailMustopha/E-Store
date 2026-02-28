"use client";
import {
  ADMIN_COUPON_VARIANT_SHOW,
  ADMIN_DASHBOARD,
} from "@/app/routes/AdminPanelRoute";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/showToast";
import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_COUPON_VARIANT_SHOW, label: "Coupons" },
  { href: "", label: "Edit Coupon" },
];

const EditCoupon = ({ params }) => {
  const { id } = use(params);
  const [loading, setLoading] = useState(false);

  // Fetching the existing coupon data
  const { data: getCoupon, loading: getCouponLoading } = useFetch(
    `/api/coupon/get/${id}`
  );

  const formSchema = zSchema.pick({
    _id: true,
    code: true,
    discountPercentage: true,
    minShoppingAmount: true,
    validity: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      code: "",
      discountPercentage: 0,
      minShoppingAmount: 0,
      validity: "",
    },
  });

  // Syncing fetched data to the form
  useEffect(() => {
    if (getCoupon && getCoupon.success) {
      const coupon = getCoupon.data;
      form.reset({
        _id: coupon?._id,
        code: coupon?.code,
        discountPercentage: coupon?.discountPercentage,
        minShoppingAmount: coupon?.minShoppingAmount,
        // Formatting date to YYYY-MM-DD for the HTML date input
        validity: coupon?.validity
          ? new Date(coupon.validity).toISOString().split("T")[0]
          : "",
      });
    }
  }, [getCoupon]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.put("/api/coupon/update", values);

      if (!response.success) {
        throw new Error(response.message);
      }

      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Edit Coupon</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                {/* Coupon Code */}
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Code <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Coupon Code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Discount Percentage */}
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Percentage (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Percentage"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Min Shopping Amount */}
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="minShoppingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min. Shopping Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Min. Amount"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Validity Date */}
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="validity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validity Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="mb-3 mt-5">
                <ButtonLoading
                  loading={loading || getCouponLoading}
                  type="submit"
                  text="Update Coupon"
                  className="w-full cursor-pointer"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCoupon;