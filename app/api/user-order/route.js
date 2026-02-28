import { isAuthenticated } from "@/lib/authentication";
import connectDB from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/Order.model";
// app/api/dashboard/user/route.js
// ... existing imports
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function GET() {
  try {
    await connectDB();
    const auth = await isAuthenticated("user");

    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    // 1. Extract values from the buffer object and convert to hex
    // Object.values turns { '0': 105, '1': 88... } into [105, 88...]
    const userId = Buffer.from(Object.values(auth.userId.buffer)).toString('hex');

    console.log("Cleaned Hex UserId:", userId);

    // 2. Fetch recent orders
    const orders = await OrderModel.find({ user: userId })
      .sort({ createdAt: -1 }) 
      .populate("products.productId", "name slug")
      .populate({
        path: "products.variantId",
        populate: { path: "media" },
      })
      .lean();


    return response(true, 200, "Dashboard info.", orders);
  } catch (error) {
    console.error("Dashboard Error:", error);
    return catchError(error);
  }
}