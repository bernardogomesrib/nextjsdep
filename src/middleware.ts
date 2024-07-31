import { NextResponse } from "next/server";
import { auth } from "../auth";

const publicRoutes = ['/login','/register','/forgot-password','/reset-password'];
const privateRoutes = ['/dashboard','/profile','/settings','/idosos','/visao_idosos','/produtos','/visao_produtos',"/saidas"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  if (privateRoutes.includes(nextUrl.pathname) && !isLoggedIn) {
    console.log('Redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}