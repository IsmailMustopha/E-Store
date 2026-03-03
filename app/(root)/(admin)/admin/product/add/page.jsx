"use client";
import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import axios from "axios";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
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

// Utils & Routes
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_SHOW,
} from "@/app/routes/AdminPanelRoute";
import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/showToast";
import { zSchema } from "@/lib/zodSchema";

// DYNAMIC IMPORT: This fixes the 500KB Babel/Slow Compile issue
const Editor = dynamic(() => import("@/components/Application/Editor"), {
  ssr: false,
  loading: () => (
    <div className="h-40 w-full bg-gray-100 animate-pulse flex items-center justify-center border rounded">
      Loading Editor...
    </div>
  ),
});

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_SHOW, label: "Products" },
  { href: "", label: "Add Product" },
];

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  const { data: getCategory } = useFetch(
    "/api/category?deleteType=SD&&size=10000",
  );

  // useMemo prevents unnecessary re-calculations on every render
  const categoryOption = useMemo(() => {
    if (getCategory?.success) {
      return getCategory.data.map((cat) => ({
        label: cat.name,
        value: cat._id,
      }));
    }
    return [];
  }, [getCategory]);

  const formSchema = zSchema.pick({
    name: true,
    slug: true,
    category: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
    description: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      description: "",
    },
  });

  // Watchers for reactive fields
  const watchName = form.watch("name");
  const watchMRP = form.watch("mrp");
  const watchSellingPrice = form.watch("sellingPrice");

  // Auto-slugify
  useEffect(() => {
    if (watchName) {
      form.setValue("slug", slugify(watchName, { lower: true, strict: true }));
    }
  }, [watchName, form]);

  // Auto-calculate Discount
  useEffect(() => {
    const mrp = Number(watchMRP) || 0;
    const sellingPrice = Number(watchSellingPrice) || 0;
    if (mrp > 0 && sellingPrice > 0) {
      const discount = ((mrp - sellingPrice) / mrp) * 100;
      form.setValue("discountPercentage", Math.round(discount));
    }
  }, [watchMRP, watchSellingPrice, form]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      if (selectedMedia.length <= 0) {
        return showToast("error", "Please select media.");
      }
      values.media = selectedMedia.map((m) => m._id);

      const { data: response } = await axios.post(
        "/api/product/create",
        values,
      );
      if (!response.success) throw new Error(response.message);

      form.reset();
      setSelectedMedia([]);
      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b pb-2">
          <h4 className="text-xl font-semibold">Add Product</h4>
        </CardHeader>
        <CardContent className="py-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Product Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          options={categoryOption}
                          selected={field.value}
                          setSelected={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input readOnly {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MRP</FormLabel>
                        <Input type="number" {...field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <Input type="number" {...field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disc %</FormLabel>
                        <Input readOnly {...field} />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormLabel className="mb-2 block">Description</FormLabel>
                  <Editor
                    onChange={(event, editor) =>
                      form.setValue("description", editor.getData())
                    }
                  />
                </div>
              </div>

              {/* Media Section */}
              <div className="mt-6 border-2 border-dashed rounded-lg p-6 text-center">
                <MediaModal
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {selectedMedia.map((media) => (
                    <div
                      key={media._id}
                      className="relative w-20 h-20 border rounded overflow-hidden"
                    >
                      <Image
                        src={media.url}
                        fill
                        alt="Preview"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="px-4 py-2 bg-secondary rounded font-medium"
                >
                  {selectedMedia.length > 0
                    ? "Add More Media"
                    : "Select Product Images"}
                </button>
              </div>

              <ButtonLoading
                loading={loading}
                type="submit"
                text="Save Product"
                className="w-full mt-6"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;

// "use client";
// import {
//   ADMIN_CATEGORY_SHOW,
//   ADMIN_DASHBOARD,
//   ADMIN_PRODUCT_SHOW,
// } from "@/app/routes/AdminPanelRoute";
// import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
// import ButtonLoading from "@/components/Application/ButtonLoading";
// import Editor from "@/components/Application/Editor";
// import MediaModal from "@/components/Application/MediaModal";
// import Select from "@/components/Application/Select";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import useFetch from "@/hooks/useFetch";
// import { showToast } from "@/lib/showToast";
// import { zSchema } from "@/lib/zodSchema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import slugify from "slugify";

// const breadcrumbData = [
//   { href: ADMIN_DASHBOARD, label: "Home" },
//   { href: ADMIN_PRODUCT_SHOW, label: "Products" },
//   { href: "", label: "Add Product" },
// ];

// const AddProduct = () => {
//   const [loading, setLoading] = useState(false);
//   const [categoryOption, setCategoryOption] = useState([]);
//   const { data: getCategory } = useFetch(
//     "/api/category?deleteType=SD&&size=10000"
//   );

//   const [open, setOpen] = useState(false);
//   const [selectedMedia, setSelectedMedia] = useState([]);

//   useEffect(() => {
//     if (getCategory && getCategory.success) {
//       const data = getCategory.data;
//       const options = data.map((cat) => ({ label: cat.name, value: cat._id }));
//       setCategoryOption(options);
//     }
//   }, [getCategory]);

//   const formSchema = zSchema.pick({
//     name: true,
//     slug: true,
//     category: true,
//     mrp: true,
//     sellingPrice: true,
//     discountPercentage: true,
//     description: true,
//   });

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       slug: "",
//       category: "",
//       mrp: 0,
//       sellingPrice: 0,
//       discountPercentage: 0,
//       description: "",
//     },
//   });

//   useEffect(() => {
//     const name = form.getValues("name");
//     if (name) {
//       form.setValue("slug", slugify(name).toLowerCase());
//     }
//   }, [form.watch("name")]);

//   const editor = (event, editor) => {
//     const data = editor.getData();
//     form.setValue("description", data);
//   };

//   // discount percentage calculation
//   useEffect(() => {
//     const mrp = form.getValues("mrp") || 0;
//     const sellingPrice = form.getValues("sellingPrice") || 0;

//     if (mrp > 0 && sellingPrice > 0) {
//       const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
//       form.setValue("discountPercentage", Math.round(discountPercentage));
//     }
//   }, [form.watch("mrp"), form.watch("sellingPrice")]);

//   const onSubmit = async (values) => {
//     setLoading(true);
//     try {
//       if (selectedMedia.length <= 0) {
//         return showToast("error", "Please select media.");
//       }

//       const mediaIds = selectedMedia.map((media) => media._id);
//       values.media = mediaIds;

//       const { data: response } = await axios.post(
//         "/api/product/create",
//         values
//       );
//       if (!response.success) {
//         throw new Error(response.message);
//       }

//       form.reset();
//       showToast("success", response.message);
//     } catch (error) {
//       showToast("error", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <BreadCrumb breadcrumbData={breadcrumbData} />

//       <Card className="py-0 rounded shadow-sm">
//         <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
//           <h4 className="text-xl font-semibold">Add Product</h4>
//         </CardHeader>
//         <CardContent className="pb-5">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)}>
//               <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
//                 <div className="mb-3">
//                   <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="">
//                           Name <span className="text-red-500">*</span>
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             type="text"
//                             placeholder="Enter Product Name"
//                             {...field}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <FormField
//                     control={form.control}
//                     name="category"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Category <span className="text-red-500">*</span>
//                         </FormLabel>
//                         <FormControl>
//                           <Select
//                             options={categoryOption}
//                             selected={field.value}
//                             setSelected={field.onChange}
//                             isMulti={false}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <FormField
//                     control={form.control}
//                     name="slug"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Slug<span className="text-red-500">*</span>
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             type="text"
//                             placeholder="Enter Slug"
//                             {...field}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <FormField
//                     control={form.control}
//                     name="mrp"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           MRP<span className="text-red-500">*</span>
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             placeholder="Enter MRP"
//                             {...field}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <FormField
//                     control={form.control}
//                     name="sellingPrice"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Selling Price</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             placeholder="Enter Selling Price"
//                             {...field}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <FormField
//                     control={form.control}
//                     name="discountPercentage"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Discount Percentage</FormLabel>
//                         <FormControl>
//                           <Input
//                             readOnly
//                             type="number"
//                             placeholder="Enter Discount Percentage"
//                             {...field}
//                           />
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 <div className="mb-5 md:col-span-2">
//                   <FormLabel className="mb-2">
//                     Description <span className="text-red-500">*</span>
//                   </FormLabel>
//                   <Editor onChange={editor} />
//                   <FormMessage></FormMessage>
//                 </div>
//               </div>

//               <div className="md:col-span-2 border border-dashed rounded p-5 text-center">
//                 <MediaModal
//                   open={open}
//                   setOpen={setOpen}
//                   selectedMedia={selectedMedia}
//                   setSelectedMedia={setSelectedMedia}
//                   isMultiple={true}
//                 />

//                 {selectedMedia.length > 0 && (
//                   <div className="flex justify-center items-center flex-wrap mb-3 gap-2">
//                     {selectedMedia.map((media) => (
//                       <div key={media._id} className="h-24 w-24 border">
//                         <Image
//                           src={media.url}
//                           height={100}
//                           width={100}
//                           alt=""
//                           className="size-full object-cover"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div
//                   onClick={() => setOpen(true)}
//                   className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer"
//                 >
//                   <span className="font-semibold">Select Media</span>
//                 </div>
//               </div>
//               <div className="mb-3 mt-5">
//                 <ButtonLoading
//                   loading={loading}
//                   type="submit"
//                   text="Add Product"
//                   className="w-full cursor-pointer"
//                 />
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AddProduct;
