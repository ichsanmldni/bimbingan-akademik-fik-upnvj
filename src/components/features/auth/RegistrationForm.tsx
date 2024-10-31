"use client";
import { useState } from "react";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import Link from "next/link";
import PasswordInput from "./PasswordInput";

const RegistrationForm = () => {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [nim, setNim] = useState("");
  const [selectedDosen, setSelectedDosen] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("");
  const [selectedPeminatan, setSelectedPeminatan] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/";
  };

  return (
    <div className="border rounded-lg w-1/2 self-center">
      <h3 className="text-center pt-4 pb-2 px-20 font-semibold text-[28px]">
        Daftar sekarang!
      </h3>
      <form
        className="pl-8 pr-2 py-4 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="pr-8 flex flex-col gap-4 overflow-y-auto max-h-[200px]">
          <InputField
            type="text"
            placeholder="Nama Lengkap"
            onChange={(e) => {
              setNamaLengkap(e.target.value);
            }}
            value={namaLengkap}
          />
          <InputField
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <InputField
            type="text"
            placeholder="NIM"
            onChange={(e) => setNim(e.target.value)}
            value={nim}
          />
          <SelectField
            options={[
              { value: "Jurusan A", label: "Jurusan A" },
              { value: "Jurusan B", label: "Jurusan B" },
              { value: "Jurusan C", label: "Jurusan C" },
            ]}
            onChange={(e) => setSelectedJurusan(e.target.value)}
            value={selectedJurusan}
            placeholder="Pilih Jurusan"
          />
          <SelectField
            options={[
              { value: "Peminatan A", label: "Peminatan A" },
              { value: "Peminatan B", label: "Peminatan B" },
              { value: "Peminatan C", label: "Peminatan C" },
            ]}
            onChange={(e) => setSelectedPeminatan(e.target.value)}
            value={selectedPeminatan}
            placeholder="Pilih Peminatan"
            disabled={selectedJurusan === ""}
          />
          <SelectField
            options={[
              { value: "Dosen PA A", label: "Dosen PA A" },
              { value: "Dosen PA B", label: "Dosen PA B" },
              { value: "Dosen PA C", label: "Dosen PA C" },
            ]}
            onChange={(e) => setSelectedDosen(e.target.value)}
            value={selectedDosen}
            placeholder="Pilih Dosen Pembimbing Akademik"
          />
          <PasswordInput />
          <PasswordInput placeholder="Konfirmasi Kata Sandi" />
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
