import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/", "/profile/:path*", "/dashboard/:path*", "/expenses/:path*", "/clubs/:path*", "/teams/:path*", "/assets/:path*", "/templates/:path*", "/calendar/:path*", "/posts/:path*", "/sponsors/:path*", "/match-events/:path*"],
};
