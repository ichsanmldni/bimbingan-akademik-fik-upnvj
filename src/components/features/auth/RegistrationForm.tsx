"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import Link from "next/link";
import PasswordInput from "../../ui/PasswordInput";
import { env } from "process";
import { toast, ToastContainer } from "react-toastify";

interface DosenPA {
  id: number;
  dosen: {
    nama_lengkap: string;
  };
}
interface DosenTetap {
  id: number;
  nama_lengkap: string;
  jurusan: string;
  email: string;
  order: number;
}

interface Jurusan {
  id: number;
  jurusan: string;
  order: number;
}

interface Peminatan {
  id: number;
  peminatan: string;
  order: number;
}

const RegistrationForm = () => {
  const [selectedNamaLengkapDosen, setSelectedNamaLengkapDosen] =
    useState<string>("");
  const [selectedEmailDosen, setSelectedEmailDosen] = useState<string>("");
  const [selectedDataDosen, setSelectedDataDosen] = useState<DosenTetap>(null);
  const [dataDosenTetap, setDataDosenTetap] = useState<DosenTetap[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const registerUser = async (userData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/registration`,
        userData
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let userData: any = {
        role: selectedRole,
        email: selectedEmailDosen,
        nama_lengkap: selectedNamaLengkapDosen,
      };

      try {
        const response = await registerUser(userData);

        if (response.status === 200) {
          toast.success(
            response?.data.message ||
              "Pengajuan pembuatan akun berhasil, silahkan cek email anda!",
            {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
          window.location.href = "/login";
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message || "Registrasi gagal!", {
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
          toast.error("Registrasi gagal!", {
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
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };
  const getDataDosenTetapByRole = async (role) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datadosentetap`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const responseData = await response.data;

      let dataByRole;

      if (role === "Kaprodi") {
        dataByRole = responseData.filter((data) => data.isKaprodi === true);
      } else {
        dataByRole = responseData.filter((data) => data.isKaprodi === false);
      }

      setDataDosenTetap(dataByRole);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  const getDataDosenTetapByNamaDosen = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datadosentetap`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;

      const dataDosen = data.find(
        (data) => data.nama_lengkap === selectedNamaLengkapDosen
      );
      console.log(dataDosen);

      setSelectedDataDosen(dataDosen);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    getDataDosenTetapByNamaDosen();
  }, [selectedNamaLengkapDosen]);

  useEffect(() => {
    document.cookie = "authBMFK=; max-age=0; path=/;";
    getDataDosenTetapByRole("Dosen PA");
  }, []);

  useEffect(() => {
    setSelectedDataDosen(null);
    setSelectedEmailDosen("");
    setSelectedNamaLengkapDosen("");
    getDataDosenTetapByRole(selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    if (selectedDataDosen) {
      setSelectedEmailDosen(selectedDataDosen.email);
    }
  }, [selectedDataDosen]);

  console.log(selectedEmailDosen);

  return (
    <div className="border rounded-lg w-1/2 self-center">
      <h3 className="text-center pt-4 pb-4 px-20 font-semibold text-[28px]">
        Daftar sekarang!
      </h3>
      <form
        className="pl-8 pr-2 pb-4 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="pr-8 flex flex-col overflow-y-auto max-h-[300px]">
          <SelectField
            options={[
              { value: "Dosen PA", label: "Dosen PA" },
              { value: "Kaprodi", label: "Kaprodi" },
            ]}
            onChange={(e) => setSelectedRole(e.target.value)}
            value={selectedRole}
            placeholder="Pilih Role"
            className={`px-3 py-2 mt-4 text-[15px] border focus:outline-none rounded-lg appearance-none w-full`}
          />
          <SelectField
            options={dataDosenTetap.map((dosen) => ({
              value: dosen.nama_lengkap,
              label: dosen.nama_lengkap,
            }))}
            onChange={(e) => {
              setSelectedNamaLengkapDosen(e.target.value);
            }}
            value={selectedNamaLengkapDosen}
            j
            placeholder={`${selectedRole === "Kaprodi" ? "Nama Kaprodi" : "Nama Dosen"}`}
            className="px-3 py-2 mt-4 text-[15px] border focus:outline-none rounded-lg appearance-none w-full"
          />
          <InputField
            type="text"
            placeholder="Email"
            value={
              selectedEmailDosen === null
                ? "Belum ada email terdaftar."
                : selectedEmailDosen
            }
            disabled={true}
            className="px-3 py-2 mt-4 text-[15px] border rounded-lg focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          />
          {selectedEmailDosen === null && (
            <p className="mt-2 ml-2 text-sm text-red-500">
              *Email belum tersedia. Silakan hubungi admin untuk memperbarui
              data Anda.
            </p>
          )}
        </div>
        <button
          type="submit"
          className="p-2 mt-2 rounded-lg text-[14px] text-white 
             bg-orange-500 disabled:bg-orange-300 
             disabled:cursor-not-allowed disabled:opacity-70"
          disabled={
            selectedRole === "" ||
            selectedNamaLengkapDosen === "" ||
            selectedEmailDosen === null
          }
        >
          Daftar
        </button>
        <div className="flex gap-2 text-[14px] justify-center">
          <p>Sudah memiliki akun?</p>
          <Link href="/login" className="text-orange-500">
            Masuk
          </Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegistrationForm;
