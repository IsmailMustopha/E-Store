"use client";
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_VARIANT_SHOW,
} from "@/app/routes/AdminPanelRoute";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import ButtonLoading from "@/components/Application/ButtonLoading";
import MediaModal from "@/components/Application/MediaModal";
import Select from "@/components/Application/Select";
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
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product Variants" },
  { href: "", label: "Edit Variant" },
];

const UpdateProductVariant = ({ params }) => {
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [productOptions, setProductOptions] = useState([]);

  const { data: getProducts } = useFetch("/api/product?deleteType=SD");
  const { data: getVariant, loading: getVariantLoading } = useFetch(
    `/api/product-variant/get/${id}`
  );

  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    if (getProducts && getProducts.success) {
      const options = getProducts.data.map((prod) => ({
        label: prod.name,
        value: prod._id,
      }));
      setProductOptions(options);
    }
  }, [getProducts]);

  const formSchema = zSchema.pick({
    _id: true,
    product: true,
    sku: true,
    color: true,
    size: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      product: "",
      sku: "",
      color: "",
      size: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
    },
  });

  useEffect(() => {
    if (getVariant && getVariant.success) {
      const variant = getVariant.data;
      form.reset({
        _id: variant?._id,
        product: variant?.product,
        sku: variant?.sku,
        color: variant?.color,
        size: variant?.size,
        mrp: variant?.mrp,
        sellingPrice: variant?.sellingPrice,
        discountPercentage: variant?.discountPercentage,
      });

      if (variant.media) {
        const media = variant.media.map((m) => ({
          _id: m._id,
          url: m.secure_url || m.url,
        }));
        setSelectedMedia(media);
      }
    }
  }, [getVariant, form]);

  useEffect(() => {
    const mrp = form.watch("mrp") || 0;
    const sellingPrice = form.watch("sellingPrice") || 0;

    if (mrp > 0) {
      const discount = ((mrp - sellingPrice) / mrp) * 100;
      form.setValue("discountPercentage", Math.round(discount));
    }
  }, [form.watch("mrp"), form.watch("sellingPrice"), form.setValue]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      if (selectedMedia.length <= 0) {
        return showToast("error", "Please select media.");
      }

      values.media = selectedMedia.map((m) => m._id);

      const { data: res } = await axios.put(
        "/api/product-variant/update",
        values
      );

      if (!res.success) throw new Error(res.message);
      showToast("success", res.message);
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
        <CardHeader className="pt-3 px-3 border-b pb-2">
          <h4 className="text-xl font-semibold">Edit Product Variant</h4>
        </CardHeader>
        <CardContent className="pb-5 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Product Selection */}
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Parent Product <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          options={productOptions}
                          selected={field.value}
                          setSelected={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SKU */}
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        SKU <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter SKU" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Color */}
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Red, Blue" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Size */}
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. XL, 42, 10-inch" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Pricing Fields */}
                <FormField
                  control={form.control}
                  name="mrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MRP</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input type="number" readOnly {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Media Section */}
              <div className="mt-8 border border-dashed rounded p-5 text-center">
                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />

                {selectedMedia.length > 0 && (
                  <div className="flex justify-center items-center flex-wrap mb-4 gap-2">
                    {selectedMedia.map((media) => (
                      <div
                        key={media._id}
                        className="h-24 w-24 border rounded overflow-hidden"
                      >
                        <Image
                          src={media.url}
                          height={100}
                          width={100}
                          alt="Variant"
                          className="size-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onClick={() => setOpen(true)}
                  className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-3 cursor-pointer rounded hover:bg-gray-100 transition"
                >
                  <span className="font-semibold">Manage Media</span>
                </div>
              </div>

              <div className="mt-8">
                <ButtonLoading
                  loading={loading || getVariantLoading}
                  type="submit"
                  text="Update Variant"
                  className="w-full"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateProductVariant;
