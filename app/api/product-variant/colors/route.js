import connectDB from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function GET() {
  try {
    await connectDB();

    const getSize = await ProductVariantModel.distinct("color")

    if (!getSize) {
      return response(false, 404, "Color not found.");
    }

    return response(true, 200, "Color found.", getSize);
  } catch (error) {
    return catchError(error);
  }
}
