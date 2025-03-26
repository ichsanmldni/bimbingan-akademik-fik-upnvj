import React, { useEffect, useState } from "react";
import PasswordInput from "../../ui/PasswordInput";
import Link from "next/link";
import SelectField from "@/components/ui/SelectField";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginProps {
  isAdmin?: boolean;
}

const LoginForm: React.FC<LoginProps> = ({ isAdmin }) => {
  const [nim, setNim] = useState<string>("");
  const [nip, setNip] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    setNim("");
    setNip("");
    setPassword("");
  }, [selectedRole]);

  useEffect(() => {
    document.cookie = "authBMFK=; max-age=0; path=/;";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const role = selectedRole === "" ? "Admin" : selectedRole;

    const requestBody: {
      nip?: string;
      nim?: string;
      email?: string;
      password: string;
      role: string;
    } = {
      password,
      role,
    };

    if (requestBody.role === "Mahasiswa") {
      requestBody.nim = nim;
    } else if (requestBody.role === "Dosen PA") {
      requestBody.nip = nip;
    } else if (requestBody.role === "Kaprodi") {
      requestBody.nip = nip;
    } else if (requestBody.role === "Admin") {
      requestBody.email = email;
    }

    try {
      const response = await axios.post("/api/auth/login", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        localStorage.setItem("authBMFK", response.data.token);
        toast.success(response?.data.message || "Login berhasil!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        window.location.href = "/";
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Login gagal!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Login gagal!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };

  return (
    <div
      className={`border mx-4 md:mx-0 rounded-xl md:rounded-lg md:w-1/2 self-center ${isAdmin && "p-4"}`}
    >
      <h3 className="text-[16px] text-center pt-4 pb-2 px-20 font-semibold md:text-[28px]">
        {isAdmin ? "Welcome, Admin!" : "Masuk sekarang!"}
      </h3>
      <form className="px-8 py-4 flex flex-col" onSubmit={handleLogin}>
        <SelectField
          options={[
            { value: "Mahasiswa", label: "Mahasiswa" },
            { value: "Dosen PA", label: "Dosen PA" },
            { value: "Kaprodi", label: "Kaprodi" },
          ]}
          onChange={(e) => setSelectedRole(e.target.value)}
          value={selectedRole}
          placeholder="Pilih Role"
          className={`px-3 py-2 text-[15px] border rounded-lg appearance-none focus:outline-none w-full ${isAdmin && "hidden"}`}
        />
        <input
          type="text"
          className={`px-3 py-2 text-[15px] mt-4 border focus:outline-none rounded-lg ${isAdmin || selectedRole !== "" ? "hidden" : ""}`}
          placeholder="NIM / NIP"
          value={nim}
          disabled={!isAdmin && selectedRole === ""}
          onChange={(e) => setNim(e.target.value)}
        />
        <input
          type="text"
          className={`px-3 py-2 text-[15px] border focus:outline-none rounded-lg ${!isAdmin && "hidden"}`}
          placeholder="Email"
          value={email}
          disabled={!isAdmin && selectedRole === ""}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          className={`px-3 py-2 text-[15px] mt-4 border focus:outline-none rounded-lg ${selectedRole !== "Mahasiswa" && "hidden"}`}
          placeholder="NIM"
          value={nim}
          disabled={!isAdmin && selectedRole === ""}
          onChange={(e) => setNim(e.target.value)}
        />
        <input
          type="text"
          className={`px-3 py-2 text-[15px] mt-4 focus:outline-none border rounded-lg ${selectedRole !== "Dosen PA" && selectedRole !== "Kaprodi" && "hidden"}`}
          placeholder="NIP"
          value={nip}
          disabled={!isAdmin && selectedRole === ""}
          onChange={(e) => setNip(e.target.value)}
        />
        <PasswordInput
          value={password}
          className="px-3 py-2 mt-4 text-[15px] focus:outline-none border rounded-lg w-full appearance-none"
          onChange={(e) => setPassword(e.target.value)}
          disabled={!isAdmin && selectedRole === ""}
        />
        {selectedRole === "Dosen PA" || selectedRole === "Kaprodi" ? (
          <div className="flex flex-col">
            <Link
              href="lupa-password"
              className="text-[14px] text-blue-500 hover:underline cursor-pointer text-end my-3"
            >
              Lupa Kata Sandi?
            </Link>
            <button
              type="submit"
              className="p-2 mb-4 rounded-lg text-[14px] bg-orange-500 text-white"
            >
              Masuk
            </button>
          </div>
        ) : (
          <button
            type="submit"
            className="p-2 mb-4 rounded-lg text-[14px] hover:bg-orange-600 mt-4 bg-orange-500 text-white"
          >
            Masuk
          </button>
        )}
        <ToastContainer />
      </form>
    </div>
  );
};

export default LoginForm;
