"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import "./globals.css";
import NavBar from "@/components/common-components/NavBar";
import Footer from "@/components/common-components/Footer";
import { CommonProvider } from "@/contexts/CommonContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use the auth check hook
  useAuthCheck();

  return (
    <html lang="en">
      <body className="">
        <CommonProvider>
          <AuthProvider>
            <NavBar />
            <div>{children}</div>
            <Footer />
          </AuthProvider>
        </CommonProvider>
      </body>
    </html>
  );
}
