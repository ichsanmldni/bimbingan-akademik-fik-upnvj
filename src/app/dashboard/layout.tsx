"use client";

import { Provider } from "react-redux";
import "../globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import store from "@/components/store/store";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        <body>{children}</body>
      </html>
    </Provider>
  );
}
