// Home.tsx
"use client";
import Logo from "@/components/ui/LogoUPNVJ";
import LoginImage from "@/components/ui/LoginImage";
import LoginForm from "@/components/features/auth/LoginForm";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center">
      <Logo className="hidden md:block mt-8 md:mx-auto md:size-[72px]" />
      <div className="md:flex gap-20 justify-center">
        <LoginImage />
        <LoginForm isAdmin={false} />
      </div>
    </div>
  );
}
