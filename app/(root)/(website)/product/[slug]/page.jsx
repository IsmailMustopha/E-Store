import axios from 'axios';
import React from 'react'
import ProductDetails from './ProductDatails';

const ProductPage = async ({ params, searchParams }) => {
  const { slug } = await params;
  const { color, size } = await searchParams;

  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`;

  // Replace the 'if (color && size)' block with this:
  const query = new URLSearchParams();
  if (color) query.append("color", color);
  if (size) query.append("size", size);

  const queryString = query.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  console.log(url);

  const { data: getProduct } = await axios.get(url);
  console.log(getProduct);

  if (!getProduct.success) {
    return (
      <div className="flex justify-center items-center py-10 h-[300px]">
        <h1 className="text-4xl font-semibold">Data not found.</h1>
      </div>
    );
  } else {
    return (
      <ProductDetails
        product={getProduct?.data?.products}
        variant={getProduct?.data?.variant}
        colors={getProduct?.data?.colors}
        sizes={getProduct?.data?.sizes}
        reviewCount={getProduct?.data?.reviewCount}
      />
    );
  }
};;

export default ProductPage;
