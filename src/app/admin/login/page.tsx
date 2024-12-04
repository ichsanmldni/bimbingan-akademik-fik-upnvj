// Home.tsx
"use client";
import Logo from "@/components/ui/LogoUPNVJ";
import LoginImage from "@/components/ui/LoginImage";
import LoginForm from "@/components/features/auth/LoginForm";
import { useState } from "react";

export default function Home() {
  const [isAdmin, setisAdmin] = useState(true);
  return (
    <div className="h-screen flex flex-col items-center">
      <Logo className="mt-8 mx-auto size-[72px]" />
      <div className="flex gap-20 justify-center">
        <LoginImage />
        <LoginForm isAdmin={isAdmin} />
      </div>
    </div>
  );
}
