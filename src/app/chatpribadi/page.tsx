"use client";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import ChatDosenPA from "@/components/features/chatpribadi/ChatDosenPA";
import ChatMahasiswa from "@/components/features/chatpribadi/ChatMahasiswa";
import { env } from "process";

export default function ChatPribadi() {
  const [roleUser, setRoleUser] = useState("");
  const [dataUser, setDataUser] = useState<any>(null);
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [dataKaprodi, setDataKaprodi] = useState([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const getDataDosenPA = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

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

  const getDataKaprodi = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datakaprodi`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataKaprodi(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("authToken="));
    if (authTokenCookie) {
      const token = authTokenCookie.split("=")[1];
      try {
        const decodedToken: any = jwtDecode(token);
        setDataUser(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    getDataDosenPA();
    getDataKaprodi();
  }, []);

  useEffect(() => {
    if (dataUser) {
      if (dataUser.role === "Mahasiswa") {
        setRoleUser("Mahasiswa");
      } else if (dataUser.role === "Dosen PA") {
        setRoleUser("Dosen PA");
      } else if (dataUser.role === "Kaprodi") {
        setRoleUser("Kaprodi");
      }
    }
  }, [dataUser, dataDosenPA, dataKaprodi]);

  return (
    <>
      {roleUser === "Mahasiswa" && <ChatDosenPA />}
      {roleUser === "Dosen PA" && <ChatMahasiswa />}
    </>
  );
}
