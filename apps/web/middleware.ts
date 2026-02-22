import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { jwtPayload, ROLES } from "@repo/types";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const callBackUrl = encodeURIComponent(`${pathname}${search}`);

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");

  if (!accessToken && !refreshToken) {
    if (isAuthPage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL(`/auth/signin?callBackUrl=${callBackUrl}`, request.url),
    );
  }

  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(
        `${process.env.API_URL_INTERNAL}/auth/refresh`,
        {
          method: "GET",
          headers: { Cookie: `refreshToken=${refreshToken}` },
        },
      );

      if (response.ok) {
        const nextResponse = NextResponse.next();
        const newCookies = response.headers.get("set-cookie");
        if (newCookies) {
          nextResponse.headers.set("set-cookie", newCookies);
        }

        return nextResponse;
      } else {
        return NextResponse.redirect(
          new URL(`/auth/signin?callBackUrl=${callBackUrl}`, request.url),
        );
      }
    } catch (error) {
      return NextResponse.redirect(
        new URL(`/auth/signin?callBackUrl=${callBackUrl}`, request.url),
      );
    }
  }

  if (accessToken && refreshToken && isAuthPage)
    return NextResponse.redirect(new URL("/", request.url));

  if (accessToken && isAdminPage) {
    try {
      const payload = decodeJwt(accessToken) as jwtPayload;

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return NextResponse.redirect(
          new URL(`/auth/signin?callBackUrl=${callBackUrl}`, request.url),
        );
      }

      if (payload.role !== ROLES.ADMIN && payload.role !== ROLES.MODERATOR)
        return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      return NextResponse.redirect(
        new URL(`/auth/signin?callBackUrl=${callBackUrl}`, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * ครอบคลุมทุกหน้า ยกเว้น:
     * - api (เดี๋ยวเราใช้ Axios จัดการเอง)
     * - _next/static, _next/image (ไฟล์ระบบ)
     * - favicon.ico, images (ไฟล์รูปภาพ)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
