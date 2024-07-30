//export { auth as middleware } from "../auth";
 import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "../auth.config";
const {auth} = NextAuth(authConfig);

const publicRoutes = ['/login','/register','/forgot-password','/reset-password'];
const privateRoutes = ['/dashboard','/profile','/settings','/idosos','/visao_idosos','/produtos','/visao_produtos'];
export default auth((req,res) => {
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;
    
    if((privateRoutes.includes(req.nextUrl.pathname)) && !isLoggedIn){
        console.log('Redirecting to login');
        return NextResponse.redirect(new URL('/login', req.url));
    }
})
export const config = {
	/*
	 * Match all request paths except for the ones starting with:
	 * - api (API routes)
	 * - _next/static (static files)
	 * - _next/image (image optimization files)
	 * - favicon.ico (favicon file)
	 */
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
