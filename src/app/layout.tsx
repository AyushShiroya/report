"use client";

import { Outfit } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import store from "@/redux/store";
import { Provider } from "react-redux";
import AuthGuard from "@/components/auth/AuthGuard";
import { usePathname } from "next/navigation";


const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

const publicRoutes = ["/signin", "/forgot-password"];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();

  const isPublicRoute = publicRoutes.includes(pathname || "");

  return (
    <html lang="en">
      <body className={`${outfit.variable} dark:bg-gray-900`}>
        <Provider store={store}>
          <ThemeProvider>
            {isPublicRoute ? (
              children
            ) : (
              <SidebarProvider>
                <AuthGuard>{children}</AuthGuard>
              </SidebarProvider>
            )}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
