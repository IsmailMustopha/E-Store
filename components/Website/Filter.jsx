"use client";
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Slider } from "../ui/slider";
import ButtonLoading from "../Application/ButtonLoading";
import { useRouter, useSearchParams } from "next/navigation";
import { WEBSITE_SHOP } from "@/app/routes/WebsitePanelRoute";
import { Button } from "../ui/button";
import Link from "next/link";

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [priceFilter, setPriceFilter] = useState({
    minPrice: 0,
    maxPrice: 300000,
  });
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const { data: categoryData } = useFetch("/api/category/get-category");
  const { data: colorData } = useFetch("/api/product-variant/colors");
  const { data: sizeData } = useFetch("/api/product-variant/sizes");
  // console.log(categoryData);

  useEffect(() => {
    searchParams.get("category")
      // eslint-disable-next-line react-hooks/set-state-in-effect
      ? setSelectedCategory(searchParams.get("category").split(","))
      : setSelectedCategory([]);
    searchParams.get("color")
      ? setSelectedColor(searchParams.get("color").split(","))
      : setSelectedColor([]);
    searchParams.get("size")
      ? setSelectedSize(searchParams.get("size").split(","))
      : setSelectedSize([]);
  }, [searchParams]);

  const handlePriceChange = (value) => {
    setPriceFilter({ minPrice: value[0], maxPrice: value[1] });
  };

  const handlePriceFilter = () => {
    urlSearchParams.set("minPrice", priceFilter.minPrice);
    urlSearchParams.set("maxPrice", priceFilter.maxPrice);
    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  const renderList = (apiResponse, renderItem) => {
    if (
      !apiResponse ||
      !apiResponse.success ||
      !Array.isArray(apiResponse.data)
    ) {
      return <li className="text-sm text-gray-400">Loading or no data...</li>;
    }
    return apiResponse.data.map(renderItem);
  };

  const urlSearchParams = new URLSearchParams(searchParams.toString());

  const handleCategoryFilter = (categorySlug) => {
    let newSelectedCategory = [...selectedCategory];
    if (newSelectedCategory.includes(categorySlug)) {
      newSelectedCategory = newSelectedCategory.filter(
        (cat) => cat !== categorySlug
      );
    } else {
      newSelectedCategory.push(categorySlug);
    }

    setSelectedCategory(newSelectedCategory);

    newSelectedCategory.length > 0
      ? urlSearchParams.set("category", newSelectedCategory.join(","))
      : urlSearchParams.delete("category");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  const handleColorFilter = (color) => {
    let newSelectedColor = [...selectedColor];
    if (newSelectedColor.includes(color)) {
      newSelectedColor = newSelectedColor.filter((cat) => cat !== color);
    } else {
      newSelectedColor.push(color);
    }

    setSelectedColor(newSelectedColor);

    newSelectedColor.length > 0
      ? urlSearchParams.set("color", newSelectedColor.join(","))
      : urlSearchParams.delete("color");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  const handleSizeFilter = (size) => {
    let newSelectedSize = [...selectedSize];
    if (newSelectedSize.includes(size)) {
      newSelectedSize = newSelectedSize.filter((cat) => cat !== size);
    } else {
      newSelectedSize.push(size);
    }

    setSelectedSize(newSelectedSize);

    newSelectedSize.length > 0
      ? urlSearchParams.set("size", newSelectedSize.join(","))
      : urlSearchParams.delete("size");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  return (
    <Accordion type="multiple" defaultValue={["1", "2", "3"]}>
      {searchParams.size > 0 && (
        <Button type="button" variant="destructive" className="w-full" asChild>
          <Link href={WEBSITE_SHOP}>Clear Filter</Link>
        </Button>
      )}
      {/* Category Section */}
      <AccordionItem value="1">
        <AccordionTrigger className="uppercase font-semibold">
          Category
        </AccordionTrigger>
        <AccordionContent>
          <div className="max-h-48 overflow-auto">
            <ul>
              {renderList(
                {
                  ...categoryData,
                  data: categoryData?.data ? [categoryData.data] : [],
                },
                (category) => (
                  <li key={category._id} className="mb-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <Checkbox
                        onCheckedChange={() =>
                          handleCategoryFilter(category.slug)
                        }
                        checked={selectedCategory.includes(category.slug)}
                      />
                      <span>{category.name}</span>
                    </label>
                  </li>
                )
              )}
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Color Section */}
      <AccordionItem value="2">
        <AccordionTrigger className="uppercase font-semibold">
          Color
        </AccordionTrigger>
        <AccordionContent>
          <div className="max-h-48 overflow-auto">
            <ul>
              {renderList(colorData, (color) => (
                <li key={color} className="mb-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      onCheckedChange={() => handleColorFilter(color)}
                      checked={selectedColor.includes(color)}
                    />
                    <span>{color}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Size Section - Corrected to use sizeData */}
      <AccordionItem value="3">
        <AccordionTrigger className="uppercase font-semibold">
          Size
        </AccordionTrigger>
        <AccordionContent>
          <div className="max-h-48 overflow-auto">
            <ul>
              {renderList(sizeData, (size) => (
                <li key={size} className="mb-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <Checkbox
                      onCheckedChange={() => handleSizeFilter(size)}
                      checked={selectedSize.includes(size)}
                    />
                    <span>{size}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="4">
        <AccordionTrigger className="uppercase font-semibold hover:no-underline">
          Price
        </AccordionTrigger>
        <AccordionContent>
          <Slider
            defaultValue={[0, 300000]}
            max={300000}
            step={1}
            onValueChange={handlePriceChange}
            className="mt-3"
          />
          <div className="flex justify-between items-center pt-2">
            <span>
              {priceFilter.minPrice.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </span>
            <span>
              {priceFilter.maxPrice.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </span>
          </div>

          <div className="mt-3">
            <ButtonLoading
              type="button"
              text="Filter Price"
              className="rounded-full"
              onClick={handlePriceFilter}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Filter;


// const Filter = () => {
//   const { data: categoryData } = useFetch('/api/category/get-category')
//   const { data: colorData } = useFetch('/api/product-variant/colors')
//   const { data: sizeData } = useFetch('/api/product-variant/sizes')

//   console.log(colorData)
//   console.log(sizeData)

//   return (
//     <Accordion type="multiple" defaultValue={["1", "2", "3", "4"]}>
      
//       <AccordionItem value="1">
//         <AccordionTrigger className="uppercase font-semibold hover:no-underline">
//           Category
//         </AccordionTrigger>
//         <AccordionContent>
//           <div className="max-h-48 overflow-auto">
//             <ul>
//               {categoryData &&
//                 categoryData.success &&
//                 categoryData.data.map((category) => (
//                   <li key={category._id} className="mb-3">
//                     <label className="flex items-center space-x-3 cursor-pointer">
//                       <Checkbox />
//                       <span>{category.name}</span>
//                     </label>
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         </AccordionContent>
//       </AccordionItem>

//       <AccordionItem value="2">
//         <AccordionTrigger className="uppercase font-semibold hover:no-underline">
//           Color
//         </AccordionTrigger>
//         <AccordionContent>
//           <div className="max-h-48 overflow-auto">
//             <ul>
//               {colorData &&
//                 colorData.success &&
//                 colorData.data.map((color) => (
//                   <li key={color} className="mb-3">
//                     <label className="flex items-center space-x-3 cursor-pointer">
//                       <Checkbox />
//                       <span>{color}</span>
//                     </label>
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         </AccordionContent>
//       </AccordionItem>

//       <AccordionItem value="2">
//         <AccordionTrigger className="uppercase font-semibold hover:no-underline">
//           Category
//         </AccordionTrigger>
//         <AccordionContent>
//           <div className="max-h-48 overflow-auto">
//             <ul>
//               {colorData &&
//                 colorData.success &&
//                 colorData.data.map((color) => (
//                   <li key={color} className="mb-3">
//                     <label className="flex items-center space-x-3 cursor-pointer">
//                       <Checkbox />
//                       <span>{color}</span>
//                     </label>
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         </AccordionContent>
//       </AccordionItem>

//       <AccordionItem value="3">
//         <AccordionTrigger className="uppercase font-semibold hover:no-underline">
//           Size
//         </AccordionTrigger>
//         <AccordionContent>
//           <div className="max-h-48 overflow-auto">
//             <ul>
//               {categoryData &&
//                 categoryData.success &&
//                 categoryData.data.map((size) => (
//                   <li key={size} className="mb-3">
//                     <label className="flex items-center space-x-3 cursor-pointer">
//                       <Checkbox />
//                       <span>{size}</span>
//                     </label>
//                   </li>
//                 ))}
//             </ul>
//           </div>
//         </AccordionContent>
//       </AccordionItem>
//     </Accordion>
//   );
// }
