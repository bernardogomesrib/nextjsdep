import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import authConfig from "./auth.config"
import db from "./lib/db"

const prisma = db;
export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
      signIn: "/login",
      signOut:"/logout",
      newUser: "/register",
    },
    adapter: PrismaAdapter(prisma),
    ...authConfig,
    
  session: {
    strategy: "jwt", // or "database"<- não tô afim de usar database
    updateAge:60,
    maxAge:3600,
    
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
        if (token.user) {
          session.user = token.user as User;
        }
        return session;
      },
      async jwt({ token, user }: { token: JWT; user?: User }) {
        if (user) {
          token.user = user;
        } else if (token.exp && Date.now() >= token.exp * 1000) {
          // Se o token expirou, retorne um token vazio
          return {};
        }
        return token;
      }
    }
  });
