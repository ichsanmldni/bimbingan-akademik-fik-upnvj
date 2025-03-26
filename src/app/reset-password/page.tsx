// Home.tsx
"use client";
import Logo from "@/components/ui/LogoUPNVJ";
import LoginImage from "@/components/ui/LoginImage";
import LoginForm from "@/components/features/auth/LoginForm";
import ResetPasswordForm from "@/components/features/auth/ResetPasswordForm";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center">
      <Logo className="hidden md:block mt-8 md:mx-auto md:size-[72px]" />
      <div className="md:flex gap-20 justify-center">
        <LoginImage />
        <ResetPasswordForm />
      </div>
    </div>
  );
}
