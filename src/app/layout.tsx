"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import "./globals.css";
import NavBar from "@/components/common-components/NavBar";
import Footer from "@/components/common-components/Footer";
import { CommonProvider } from "@/contexts/CommonContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import GlobalGradientScrollbar from "@/components/common-components/GlobalGradientScrollbar";
import ThemePicker from "@/components/common-components/ThemePicker";
import { NotificationProvider } from "@/contexts/NotificationContext";

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
            <NotificationProvider>
              <ThemeProvider>
                <GlobalGradientScrollbar />
                <ThemePicker />
                <NavBar />
                <div>{children}</div>
                <Footer />
              </ThemeProvider>
            </NotificationProvider>
          </AuthProvider>
        </CommonProvider>
      </body>
    </html>
  );
}
