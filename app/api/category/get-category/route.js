import connectDB from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";

export async function GET() {
  try {

    await connectDB();


    const getCatergory = await CategoryModel.findOne({deleteType: null}).lean();

    if (!getCatergory) {
      return response(false, 404, "Category not found.");
    }

    return response(true, 200, "Category found.", getCatergory);
  } catch (error) {
    return catchError(error);
  }
}
