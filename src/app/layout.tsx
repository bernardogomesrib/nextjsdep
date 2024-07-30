import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import Navbar from "./components-form-and-navbar/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "farmacia app",
  description: "site para gerenciar a farmacia do abrigo cristo redentor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="PT-BR">
      <SessionProvider>
      <body className={inter.className}>
        <Navbar />
        {children}
        </body>
        </SessionProvider>
    </html>
  );
}
