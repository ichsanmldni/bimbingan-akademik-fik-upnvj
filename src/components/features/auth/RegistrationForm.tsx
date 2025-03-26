"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import Link from "next/link";
import PasswordInput from "../../ui/PasswordInput";
import { env } from "process";

interface DosenPA {
  id: number;
  dosen: {
    nama_lengkap: string;
  };
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
  const [namaLengkap, setNamaLengkap] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [nim, setNim] = useState<string>("");
  const [nip, setNip] = useState<string>("");
  const [noWa, setNoWa] = useState<string>("");
  const [dataDosenPA, setDataDosenPA] = useState<DosenPA[]>([]);
  const [dataJurusan, setDataJurusan] = useState<Jurusan[]>([]);
  const [dataPeminatan, setDataPeminatan] = useState<Peminatan[]>([]);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [selectedDosen, setSelectedDosen] = useState<string>("");
  const [selectedJurusan, setSelectedJurusan] = useState<string>("");
  const [selectedPeminatan, setSelectedPeminatan] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [optionsDosenPA, setOptionsDosenPA] = useState<
    { value: string; label: string }[]
  >([]);
  const [optionsJurusan, setOptionsJurusan] = useState<
    { value: string; label: string }[]
  >([]);
  const [optionsPeminatan, setOptionsPeminatan] = useState<
    { value: string; label: string }[]
  >([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const getDataJurusan = async () => {
    try {
      const response = await axios.post<Jurusan[]>(
        `${API_BASE_URL}/api/datajurusan`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataJurusan = data.sort((a, b) => a.order - b.order);
      setDataJurusan(sortedDataJurusan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataPeminatanByJurusan = async (selectedJurusan: string) => {
    try {
      const dataJurusan = await axios.post<Jurusan[]>(
        `${API_BASE_URL}/api/datajurusan`
      );

      const jurusan = dataJurusan.data.find(
        (data) => data.jurusan === selectedJurusan
      );

      if (!jurusan) {
        throw new Error("Jurusan tidak ditemukan");
      }

      const jurusanid = jurusan.id;

      const response = await axios.get<Peminatan[]>(
        `${API_BASE_URL}/api/datapeminatan/${jurusanid}`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      const sortedDataPeminatan = data.sort((a, b) => a.order - b.order);
      setDataPeminatan(sortedDataPeminatan);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataDosenPA = async () => {
    try {
      const response = await axios.get<DosenPA[]>(
        `${API_BASE_URL}/api/datadosenpa`
      );

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataDosenPA(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const registerUser = async (userData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/registration`,
        userData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (confirmPassword !== password) {
      alert("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      let userData: any = {
        role: selectedRole,
        email,
        password,
        no_whatsapp: noWa,
        nama_lengkap: namaLengkap,
        nama_dosen_PA: selectedDosen,
      };

      // Tambahkan data spesifik berdasarkan role
      if (selectedRole === "Mahasiswa") {
        userData = {
          ...userData,
          nim,
          peminatan: selectedPeminatan,
          jurusan: selectedJurusan,
        };
      } else if (selectedRole === "Dosen") {
        userData = {
          ...userData,
          nip,
        };
      }

      // Panggil fungsi registerUser dengan data yang sudah disesuaikan
      const result = await registerUser(userData);

      window.location.href = "/login";
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  useEffect(() => {
    document.cookie = "authBMFK=; max-age=0; path=/;";
    getDataDosenPA();
    getDataJurusan();
  }, []);

  useEffect(() => {
    setOptionsPeminatan([]);
    if (selectedJurusan) {
      getDataPeminatanByJurusan(selectedJurusan);
    }
  }, [selectedJurusan]);

  useEffect(() => {
    if (dataDosenPA.length > 0) {
      const formattedOptions = dataDosenPA.map((data) => {
        return {
          value: data.dosen.nama_lengkap,
          label: data.dosen.nama_lengkap,
        };
      });

      setOptionsDosenPA(formattedOptions);
    }
  }, [dataDosenPA]);

  useEffect(() => {
    if (dataJurusan.length > 0) {
      const formattedOptions = dataJurusan.map((data) => {
        return {
          value: data.jurusan,
          label: data.jurusan,
        };
      });

      setOptionsJurusan(formattedOptions);
    }
  }, [dataJurusan]);

  useEffect(() => {
    if (dataPeminatan.length > 0) {
      const formattedOptions = dataPeminatan.map((data) => {
        return {
          value: data.peminatan,
          label: data.peminatan,
        };
      });

      setOptionsPeminatan(formattedOptions);
    }
  }, [dataPeminatan]);

  useEffect(() => {
    setEmail("");
    setNoWa("");
    setNamaLengkap("");
    setSelectedDosen("");
    setNim("");
    setNip("");
    setSelectedPeminatan("");
    setSelectedJurusan("");
    setPassword("");
    setConfirmPassword("");
  }, [selectedRole]);

  return (
    <div className="border rounded-lg w-1/2 self-center">
      <h3 className="text-center pt-4 pb-4 px-20 font-semibold text-[28px]">
        Daftar sekarang!
      </h3>
      <form
        className="pl-8 pr-2 pb-4 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="pr-8 flex flex-col overflow-y-auto max-h-[200px]">
          <SelectField
            options={[
              { value: "Mahasiswa", label: "Mahasiswa" },
              { value: "Dosen", label: "Dosen" },
            ]}
            onChange={(e) => setSelectedRole(e.target.value)}
            value={selectedRole}
            placeholder="Pilih Role"
            className={`px-3 py-2 mt-4 text-[15px] border rounded-lg appearance-none w-full`}
          />
          <InputField
            type="text"
            placeholder="Nama Lengkap"
            onChange={(e) => setNamaLengkap(e.target.value)}
            value={namaLengkap}
            disabled={selectedRole === ""}
            className="px-3 py-2 mt-4 text-[15px] border rounded-lg"
          />
          <InputField
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={selectedRole === ""}
            className="px-3 py-2 mt-4 text-[15px] border rounded-lg"
          />
          <InputField
            type="text"
            placeholder="NIM"
            onChange={(e) => setNim(e.target.value)}
            value={nim}
            disabled={selectedRole === ""}
            className={`${selectedRole === "Mahasiswa" ? "block" : "hidden"} px-3 py-2 mt-4 text-[15px] border rounded-lg`}
          />
          <InputField
            type="text"
            placeholder="NIP"
            onChange={(e) => setNip(e.target.value)}
            value={nip}
            disabled={selectedRole === ""}
            className={`${selectedRole === "Dosen" ? "block" : "hidden"} px-3 py-2 mt-4 text-[15px] border rounded-lg`}
          />
          <InputField
            type="text"
            placeholder="No Whatsapp"
            onChange={(e) => setNoWa(e.target.value)}
            value={noWa}
            disabled={selectedRole === ""}
            className="px-3 py-2 mt-4 text-[15px] border rounded-lg"
          />
          <SelectField
            options={optionsJurusan}
            onChange={(e) => setSelectedJurusan(e.target.value)}
            value={selectedJurusan}
            placeholder="Pilih Jurusan"
            className={`${selectedRole === "Mahasiswa" ? "block" : "hidden"} px-3 py-2 mt-4 text-[15px] border rounded-lg appearance-none w-full`}
          />
          <SelectField
            options={optionsPeminatan}
            onChange={(e) => setSelectedPeminatan(e.target.value)}
            value={selectedPeminatan}
            placeholder="Pilih Peminatan"
            disabled={selectedJurusan === ""}
            className={`${selectedRole === "Mahasiswa" ? "block" : "hidden"} px-3 py-2 mt-4 text-[15px] border rounded-lg appearance-none w-full`}
          />
          <SelectField
            options={optionsDosenPA}
            onChange={(e) => setSelectedDosen(e.target.value)}
            value={selectedDosen}
            placeholder="Pilih Dosen Pembimbing Akademik"
            className={`${selectedRole === "Mahasiswa" ? "block" : "hidden"} px-3 py-2 mt-4 text-[15px] border rounded-lg appearance-none w-full`}
          />
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 text-[15px] mt-4 border rounded-lg w-full"
            disabled={selectedRole === ""}
            value={password}
          />
          <PasswordInput
            className="px-3 py-2 text-[15px] mt-4 border rounded-lg w-full"
            disabled={selectedRole === ""}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Konfirmasi Kata Sandi"
            value={confirmPassword}
          />
        </div>
        <button
          type="submit"
          className="p-2 mt-2 rounded-lg text-[14px] bg-orange-500 text-white"
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
    </div>
  );
};

export default RegistrationForm;
