import Image from "next/image";
import React from "react";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import Link from "next/link";
import { WEBSITE_PRODUCT_DETAILS } from "@/app/routes/WebsitePanelRoute";

const ProductBox = ({ product }) => {
  // console.log(product);
  
return (
  <div className="rounded-lg hover:shadow-lg border overflow-hidden">
    <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
      <Image
        src={product?.media[0]?.secure_url || imgPlaceholder.src}
        width={400}
        height={400}
        alt={product?.media[0]?.alt || product?.name}
        title={product?.media[0]?.title || product?.name}
        className="w-full lg:h-[300px] md:h-[200px] h-[150px] object-cover object-top"
      />
      <div className="p-3">
        <h4>{product?.name}</h4>
        <p className="flex gap-2 text-sm mt-3">
          <span className="line-through text-gray-400">
            {product?.mrp.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
          <span className="font-semibold">
            {product?.sellingPrice.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </p>
      </div>
    </Link>
  </div>
);
};

export default ProductBox;
