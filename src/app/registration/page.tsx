"use client";
import Logo from "@/components/ui/LogoUPNVJ";
import LoginImage from "@/components/ui/LoginImage";
import RegistrationForm from "@/components/features/auth/RegistrationForm";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center">
      <Logo className="hidden md:block mt-8 md:mx-auto md:size-[72px]" />
      <div className="md:flex gap-20 justify-center">
        <LoginImage />
        <RegistrationForm />
      </div>
    </div>
  );
}
