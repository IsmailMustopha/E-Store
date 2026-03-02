import { isAuthenticated } from "@/lib/authentication";
import connectDB from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function PUT(request) {
  try {
      const auth = await isAuthenticated("admin");
      if (!auth.isAuth) return response(false, 403, "Unauthorized.");
  
      await connectDB();
      const payload = await request.json();
  
      // 1. Validate Schema
      const schema = zSchema.pick({
        _id: true,
        product: true,
        sku: true,
        color: true,
        size: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
        media: true,
      });
  
      const validate = schema.safeParse(payload);
      if (!validate.success) {
        return response(false, 400, "Invalid or missing fields.", validate.error);
      }
  
      const { _id, ...updateData } = validate.data;
  
      // 2. Check for SKU uniqueness (if SKU is being changed)
      if (updateData.sku) {
        const existingSku = await ProductVariantModel.findOne({
          sku: updateData.sku,
          _id: { $ne: _id },
        });
        if (existingSku)
          return response(false, 400, "SKU already in use by another variant.");
      }
  
      // 3. Perform Atomic Update
      const updatedVariant = await ProductVariantModel.findOneAndUpdate(
        { _id, deletedAt: null },
        { $set: updateData },
        { new: true, runValidators: true }, // returns the updated doc and runs model validations
      );
  
      if (!updatedVariant) {
        return response(false, 404, "Product variant not found.");
      }
  
      return response(
        true,
        200,
        "Product variant updated successfully.",
        updatedVariant,
      );
    } catch (error) {
      return catchError(error);
    }
}



// import { isAuthenticated } from "@/lib/authentication";
// import connectDB from "@/lib/databaseConnection";
// import { catchError, response } from "@/lib/helperFunction";
// import { zSchema } from "@/lib/zodSchema";
// import ProductVariantModel from "@/models/ProductVariant.model";

// export async function PUT(request) {
//   try {
//     const auth = await isAuthenticated("admin");
//     if (!auth.isAuth) {
//       return response(false, 403, "Unauthorized.");
//     }

//     await connectDB();
//     const payload = await request.json();

//     const schema = zSchema.pick({
//       _id: true,
//       product: true,
//       sku: true,
//       color: true,
//       size: true,
//       mrp: true,
//       sellingPrice: true,
//       discountPercentage: true,
//       media: true,
//     });

//     const validate = schema.safeParse(payload);
//     if (!validate.success) {
//       return response(false, 400, "Invalid or missing fields.", validate.error);
//     }

//     const validatedData = validate.data;

//     const getProductVariant = await ProductVariantModel.findOne({
//       deletedAt: null,
//       _id: validatedData._id,
//     });
//     if (!getProductVariant) {
//       return response(false, 404, "Data not found.");
//     }

//     getProductVariant.product = validatedData.product;
//     getProductVariant.color = validatedData.color;
//     getProductVariant.size = validatedData.size;
//     getProductVariant.sku = validatedData.sku;
//     getProductVariant.mrp = validatedData.mrp;
//     getProductVariant.sellingPrice = validatedData.sellingPrice;
//     getProductVariant.discountPercentage = validatedData.discountPercentage;
//     getProductVariant.media = validatedData.media;
//     await getProductVariant.save();

//     return response(true, 200, "Product variant updated successfully.");
//   } catch (error) {
//     return catchError(error);
//   }
// }
