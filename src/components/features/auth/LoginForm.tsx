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
    document.cookie = "authToken=; max-age=0; path=/;";
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
    }

    if (requestBody.role === "Dosen") {
      requestBody.nip = nip;
    }

    if (requestBody.role === "Admin") {
      requestBody.email = email;
    }

    try {
      // Menggunakan axios untuk melakukan permintaan POST
      const response = await axios.post("/api/auth/login", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Menyimpan token jika permintaan berhasil
      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
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
      // Menangani kesalahan jika permintaan gagal
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
    <div className={`border rounded-lg w-1/2 self-center ${isAdmin && "p-4"}`}>
      <h3 className="text-center pt-4 pb-2 px-20 font-semibold text-[28px]">
        {isAdmin ? "Welcome, Admin!" : "Masuk sekarang!"}
      </h3>
      <form className="px-8 py-4 flex flex-col" onSubmit={handleLogin}>
        <SelectField
          options={[
            { value: "Mahasiswa", label: "Mahasiswa" },
            { value: "Dosen", label: "Dosen" },
          ]}
          onChange={(e) => setSelectedRole(e.target.value)}
          value={selectedRole}
          placeholder="Pilih Role"
          className={`px-3 py-2 text-[15px] border rounded-lg appearance-none w-full ${isAdmin && "hidden"}`}
        />
        <input
          type="text"
          className={`px-3 py-2 text-[15px] mt-4 border rounded-lg ${isAdmin || selectedRole !== "" ? "hidden" : ""}`}
          placeholder="NIM / NIP"
          value={nim}
          disabled={!isAdmin && selectedRole === ""}
          onChange={(e) => setNim(e.target.value)}
        />
        <input
          type="text"
          className={`px-3 py-2 text-[15px] border rounded-lg ${!isAdmin && "hidden"}`}
          placeholder="Email"
          value={email}
          disabled={!isAdmin && selectedRole === ""}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          className={`px-3 py-2 text-[15px] mt-4 border rounded-lg ${selectedRole !== "Mahasiswa" && "hidden"}`}
          placeholder="NIM"
          value={nim}
          disabled={!isAdmin && selectedRole === ""}
          onChange={(e) => setNim(e.target.value)}
        />
        <input
          type="text"
          className={`px-3 py-2 text-[15px] mt-4 border rounded-lg ${selectedRole !== "Dosen" && "hidden"}`}
          placeholder="NIP"
          value={nip}
          disabled={!isAdmin && selectedRole === ""}
          onChange={(e) => setNip(e.target.value)}
        />
        <PasswordInput
          value={password}
          className="px-3 py-2 mt-4 text-[15px] border rounded-lg w-full appearance-none"
          onChange={(e) => setPassword(e.target.value)}
          disabled={!isAdmin && selectedRole === ""}
        />
        <button
          type="submit"
          className="p-2 mb-4 rounded-lg text-[14px] bg-orange-500 text-white mt-4"
        >
          Masuk
        </button>
        <ToastContainer />
      </form>
    </div>
  );
};

export default LoginForm;
