import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "./PasswordInput";
import Link from "next/link";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
    router.push("/");
  };

  return (
    <div className="border rounded-lg w-1/2 self-center">
      <h3 className="text-center pt-4 pb-2 px-20 font-semibold text-[28px]">
        Masuk sekarang!
      </h3>
      <form className="px-8 py-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          className="px-3 py-2 text-[15px] border rounded-lg"
          placeholder="Email / NIM"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput />
        <p className="text-end text-[14px] cursor-pointer">Forgot Password?</p>
        <button
          type="submit"
          className="p-2 rounded-lg text-[14px] bg-orange-500 text-white"
        >
          Masuk
        </button>
        <div className="flex gap-2 text-[14px] justify-center">
          <p>Belum memiliki akun?</p>
          <Link href="/registration" className="text-orange-500">
            Daftar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
