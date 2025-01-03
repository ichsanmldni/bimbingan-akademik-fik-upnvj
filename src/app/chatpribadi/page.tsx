"use client";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import ChatDosenPA from "@/components/features/chatpribadi/ChatDosenPA";
import ChatMahasiswa from "@/components/features/chatpribadi/ChatMahasiswa";
import { env } from "process";

interface User {
  id: number;
  role: string;
}

interface DosenPA {
  dosen_id: number;
}

interface Kaprodi {
  dosen_id: number;
}

export default function ChatPribadi() {
  const [roleUser, setRoleUser] = useState<string>("");
  const [dataUser, setDataUser] = useState<User | null>(null);
  const [dataDosenPA, setDataDosenPA] = useState<DosenPA[]>([]);
  const [dataKaprodi, setDataKaprodi] = useState<Kaprodi[]>([]);

  const API_BASE_URL = env.API_BASE_URL as string;

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
        const decodedToken = jwtDecode<User>(token);
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
      } else if (dataUser.role === "Dosen") {
        const isDosenPA = dataDosenPA.find(
          (data) => data.dosen_id === dataUser.id
        );
        const isKaprodi = dataKaprodi.find(
          (data) => data.dosen_id === dataUser.id
        );
        if (isDosenPA) {
          setRoleUser("Dosen PA");
        } else if (isKaprodi) {
          setRoleUser("Kaprodi");
        }
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
