import { NextResponse } from "next/server";
import { WEBSITE_LOGIN } from "./app/routes/WebsitePanelRoute";
import { ADMIN_DASHBOARD } from "./app/routes/AdminPanelRoute";
import { jwtVerify } from "jose";

export async function middleware(request) {
  try {
    const pathname = request.nextUrl.pathname;
    const hasToken = request.cookies.has("access_token");

    if (!hasToken) {
      if (!pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
      }

      return NextResponse.next(); 
    }
    // verify token
    const access_token = request.cookies.get('access_token').value
    const { payload } = await jwtVerify(access_token, new TextEncoder().encode(process.env.SECRET_KEY))

    const role = payload.role

    // prevent logged-in users from accessing auth routes
    if (pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL(role === 'admin' ? ADMIN_DASHBOARD : USER_DASHBOARD, request.nextUrl))
    }
    
    // protect admin route
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
    }

    // protect user route
    if (pathname.startsWith('/my-account') && role !== 'user') {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
    }
    
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
  }
}

export const config = {
  matcher: ["/admin/:path*", "/my-account/:path*", "/auth/:path*"],
};