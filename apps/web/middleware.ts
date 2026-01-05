import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthPage = pathname.startsWith("/auth");

  if (!accessToken && !refreshToken) {
    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    return NextResponse.next();
  }

  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(
        `${process.env.API_URL_INTERNAL}/auth/refresh`,
        {
          method: "GET",
          headers: { Cookie: `refreshToken=${refreshToken}` },
        }
      );

      if (response.ok) {
        const nextResponse = NextResponse.next();
        const newCookies = response.headers.get("set-cookie");
        if (newCookies) {
          nextResponse.headers.set("set-cookie", newCookies);
        }

        return nextResponse;
      } else {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  if (accessToken && refreshToken && isAuthPage)
    return NextResponse.redirect(new URL("/", request.url));

  // 5. ถ้ามี Access Token อยู่แล้ว หรืออยู่ในหน้า Auth อยู่แล้ว
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
