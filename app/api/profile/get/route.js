import { isAuthenticated } from "@/lib/authentication";
import connectDB from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";

export async function GET() {
  try {
    await connectDB();
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    // --- APPLYING THE FIX ---
    let userId;
    if (auth.userId && typeof auth.userId === "object" && auth.userId.buffer) {
      // Reconstruct the hex string from the buffer object values
      const bufferValues = Object.values(auth.userId.buffer);
      userId = Buffer.from(bufferValues).toString("hex");
    } else {
      // Fallback for standard string or ObjectId
      userId = auth.userId?.toString();
    }
    // ------------------------

    console.log("Final Hex ID:", userId);

    const user = await UserModel.findById(userId).lean();

    if (!user) {
      return response(false, 404, "User not found.");
    }

    return response(true, 200, "User | data.", user);
  } catch (error) {
    console.error("GET Profile Error:", error);
    return catchError(error);
  }
}

// import { isAuthenticated } from "@/lib/authentication";
// import connectDB from "@/lib/databaseConnection";
// import { catchError, response } from "@/lib/helperFunction";
// import UserModel from "@/models/User.model";

// export async function GET() {
//   try {
//     await connectDB();
//     const auth = await isAuthenticated("user");
//     if (!auth.isAuth) {
//       return response(false, 401, "Unauthorized");
//     }

//     const userId = auth.userId.toString();

//     console.log("user Id",userId)

//     const user = await UserModel.findById(userId).lean();

//     return response(true, 200, "User | data.", user);
//   } catch (error) {
//     return catchError(error);
//   }
// }
