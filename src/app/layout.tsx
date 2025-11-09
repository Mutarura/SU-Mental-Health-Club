'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { usePathname } from 'next/navigation';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  icons: {
    icon: "/strathmore-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname === '/admin';

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/strathmore-logo.png" />
        <meta name="google-site-verification" content="google8bfa5cb007efc481.html" />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}
