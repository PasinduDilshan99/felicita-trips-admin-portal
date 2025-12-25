"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import "./globals.css";
import NavBar from "@/components/common-components/NavBar";
import Footer from "@/components/common-components/Footer";

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
        <AuthProvider>
          <NavBar />
          <div>{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
