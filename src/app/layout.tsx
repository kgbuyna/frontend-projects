import React from "react";
import { Providers } from "@/store/providers";
import MyApp from "./app";
import "./global.css";
import { UserProvider } from "@/store/hooks/UserContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Modernize Main Demo",
  description: "Modernize Main kit"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Toaster />

        <Providers>
          <MyApp>{children}</MyApp>
        </Providers>
      </body>
    </html>
  );
}
