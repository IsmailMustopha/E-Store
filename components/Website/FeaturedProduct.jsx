// import Link from "next/link";
// import React from "react";
// import { IoIosArrowRoundForward } from "react-icons/io";
// import ProductBox from "./ProductBox";
// import connectDB from "@/lib/databaseConnection";
// import ProductModel from "@/models/Product.model";
// import "@/models/Media.model"; // Ensure Media model is registered for populate

// const FeaturedProduct = async () => {
//   let products = [];

//   try {
//     // 1. Talk to the DB directly (Same logic as your API)
//     await connectDB();

//     products = await ProductModel.find({ deletedAt: null })
//       .populate("media")
//       .limit(8)
//       .lean();
//   } catch (error) {
//     console.error("Database Error:", error);
//   }

//   // If DB fails or returns nothing, hide the section
//   if (!products || products.length === 0) return null;

//   return (
//     <section className="lg:px-32 px-4 sm:py-10">
//       <div className="flex justify-between items-center mb-5">
//         <h2 className="sm:text-4xl text-2xl font-semibold">
//           Featured Products
//         </h2>
//         <Link
//           href="/shop"
//           className="flex items-center gap-2 underline underline-offset-4 hover:text-primary"
//         >
//           View All
//           <IoIosArrowRoundForward />
//         </Link>
//       </div>

//       <div className="grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2">
//         {products.map((product) => (
//           /* Crucial for Next.js 15: Mongoose objects must be converted 
//              to plain JSON to pass from Server to Client components.
//           */
//           <ProductBox
//             key={product._id.toString()}
//             product={JSON.parse(JSON.stringify(product))}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default FeaturedProduct;

import axios from "axios";
import Link from "next/link";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import ProductBox from "./ProductBox";

const FeaturedProduct = async () => {
 let productData = null;
 try {
   const { data } = await axios.get(
     `${process.env.API_BASE_URL}/product/get-featured-product`,
   );
   productData = data;
 } catch (error) {
   console.log(error);
 }

  if(!productData) return null
  return (
    <section className="lg:px-32 px-4 sm:py-10">
      <div className="flex justify-between items-center mb-5">
        <h2 className="sm:text-4xl text-2xl font-semibold">
          Featured Products
        </h2>
        <Link
          href=""
          className="flex items-center gap-2 underline underline-offset-4 hover:text-primary"
        >
          View All
          <IoIosArrowRoundForward />
        </Link>
      </div>
      <div className="grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2">
        {!productData.success && (
          <div className="text-center py-5">Data Not Found.</div>
        )}

        {productData.success &&
          Array.isArray(productData.data) &&
          productData.data.map((product) => (
            <ProductBox key={product._id} product={product} /> //
          ))}
      </div>
      {/* <div className="grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2">
        {!productData.success && (
          <div className="text-center py-5">Data Not Found.</div>
        )}

        {productData.success &&
          productData.data.map((product) => (
            <ProductBox key={product._id} product={product} />
          ))}
      </div> */}
    </section>
  );
};

export default FeaturedProduct;
