// RootLayout.tsx
"use client";

import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Provider } from "react-redux";
import store from "@/components/store/store";
import { metadata } from "./metadata";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <html lang="en" className={jakarta.className}>
        <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
          <link rel="manifest" href={metadata.manifest} />
          <link rel="icon" href="/bimafiklogo.png" />
        </head>
        <body>{children}</body>
      </html>
    </Provider>
  );
}
