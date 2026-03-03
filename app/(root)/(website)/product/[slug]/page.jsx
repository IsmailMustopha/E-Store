import React from "react";
import { Types } from "mongoose";
import connectDB from "@/lib/databaseConnection";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import ReviewModel from "@/models/Review.model";
import ProductDetails from "./ProductDatails";

const ProductPage = async ({ params, searchParams }) => {
  // 1. Await params as required by Next.js 15
  const { slug } = await params;
  const { color, size } = await searchParams;

  try {
    // 2. Connect to DB directly
    await connectDB();

    // 3. Reuse your exact API logic here
 const filter = {
   deletedAt: null,
   slug: slug, // Just use the direct string instead of Regex for a moment
 };

    const getProduct = await ProductModel.findOne(filter)
      .populate("media", "secure_url")
      .lean();

    if (!getProduct) {
      return (
        <div className="flex justify-center items-center py-10 h-[300px]">
          <h1 className="text-4xl font-semibold">Product not found.</h1>
        </div>
      );
    }

    // 4. Variant Logic
    const variantFilter = {
      product: new Types.ObjectId(getProduct._id),
      deletedAt: null,
    };
    if (size) variantFilter.size = size;
    if (color) variantFilter.color = color;

    let variant = await ProductVariantModel.findOne(variantFilter)
      .populate("media")
      .lean();

    // Fallback: get first variant if specific one isn't found
    if (!variant && (size || color)) {
      variant = await ProductVariantModel.findOne({
        product: getProduct._id,
        deletedAt: null,
      })
        .populate("media")
        .lean();
    }

    if (!variant) {
      return <div>This product has no available variants.</div>;
    }

    // 5. Aggregate Colors and Sizes
    const getColor = await ProductVariantModel.distinct("color", {
      product: getProduct._id,
      deletedAt: null,
    });

    const getSize = await ProductVariantModel.aggregate([
      { $match: { product: getProduct._id, deletedAt: null } },
      { $group: { _id: "$size", first: { $first: "$_id" } } },
      { $sort: { first: 1 } },
      { $project: { _id: 0, size: "$_id" } },
    ]);

    const review = await ReviewModel.countDocuments({
      product: getProduct._id,
    });

    // 6. Pass data to your Client Component
   return (
     <ProductDetails
       product={JSON.parse(JSON.stringify(getProduct))}
       variant={JSON.parse(JSON.stringify(variant))}
       colors={getColor}
       sizes={getSize.length ? getSize.map((item) => item.size) : []}
       reviewCount={review}
     />
   );
  }catch (error) {
  return (
    <div className="p-10">
      <h1>Debug Error: {error.message}</h1>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
};
}

export default ProductPage;

// import axios from 'axios';
// import React from 'react'
// import ProductDetails from './ProductDatails';

// const ProductPage = async ({ params, searchParams }) => {
//   const { slug } = await params;
//   const { color, size } = await searchParams;

//   let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`;

//   // Replace the 'if (color && size)' block with this:
//   const query = new URLSearchParams();
//   if (color) query.append("color", color);
//   if (size) query.append("size", size);

//   const queryString = query.toString();
//   if (queryString) {
//     url += `?${queryString}`;
//   }
//   console.log(url);

//   const { data: getProduct } = await axios.get(url);
//   console.log(getProduct);

//   if (!getProduct.success) {
//     return (
//       <div className="flex justify-center items-center py-10 h-[300px]">
//         <h1 className="text-4xl font-semibold">Data not found.</h1>
//       </div>
//     );
//   } else {
//     return (
//       <ProductDetails
//         product={getProduct?.data?.products}
//         variant={getProduct?.data?.variant}
//         colors={getProduct?.data?.colors}
//         sizes={getProduct?.data?.sizes}
//         reviewCount={getProduct?.data?.reviewCount}
//       />
//     );
//   }
// };;

// export default ProductPage;
