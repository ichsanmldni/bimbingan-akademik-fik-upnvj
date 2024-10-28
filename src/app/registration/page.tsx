"use client";
import Logo from "@/components/ui/LogoUPNVJ";
import LoginImage from "@/components/ui/LoginImage";
import RegistrationForm from "@/components/features/auth/RegistrationForm";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center">
      <Logo className="mt-8 mx-auto size-[72px]" />
      <div className="flex gap-20 justify-center">
        <LoginImage />
        <RegistrationForm />
      </div>
    </div>
  );
}
