"use client";
import ChatBubble from "@/components/ui/chatbot/BubbleChatStart";
import HeaderChatbot from "@/components/ui/chatbot/ChatDosenHeader";
import NavbarChatbot from "@/components/ui/chatbot/NavbarChatbot";
import SidebarChatbot from "@/components/ui/chatbot/SidebarChatbot";
import TextInputPesanMahasiswa from "@/components/ui/chatbot/TextInputPesanMahasiswa";
import backIcon from "../../../assets/images/back-icon-black.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { MessageSquareText, Sidebar } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MessageMahasiswa from "@/components/ui/chatbot/MessageMahasiswa";
import BubbleChat from "@/components/ui/chatbot/BubbleChatStart";
import BubbleChatStart from "@/components/ui/chatbot/BubbleChatStart";
import BubbleChatEnd from "@/components/ui/chatbot/BubbleChatEnd";

export default function ChatDosenPA() {
  const [dataUser, setDataUser] = useState({});
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [dataKaprodi, setDataKaprodi] = useState([]);
  const [userDosenPA, setUserDosenPA] = useState({});
  const [isMahasiswaChatting, setIsMahasiswaChatting] = useState(false);
  const [selectedDataChatPribadi, setSelectedDataChatPribadi] = useState({});
  const [chatData, setChatData] = useState([]);
  const [chatMahasiswaData, setChatMahasiswaData] = useState([]);
  const [chatDosenPAData, setChatDosenPAData] = useState([]);
  const [sortedChatData, setSortedChatData] = useState([]);

  const addChatMahasiswa = async (newChat) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/chatmahasiswa",
        newChat
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddChatMahasiswa = async (newData) => {
    if (selectedDataChatPribadi.id) {
      const newChat = {
        ...newData,
        chat_pribadi_id: selectedDataChatPribadi.id,
      };
      try {
        const result = await addChatMahasiswa(newChat);
        getDataChatPribadiByMahasiswaId();
      } catch (error) {
        console.error("Registration error:", error.message);
      }
    } else {
      const newChat = {
        ...newData,
        mahasiswa_id: dataUser.id,
        dosen_pa_id: userDosenPA.id,
      };
      try {
        const result = await addChatMahasiswa(newChat);
        getDataChatPribadiByMahasiswaId();
      } catch (error) {
        console.error("Registration error:", error.message);
      }
    }
  };

  //   const onSubmitHandler = (newMessage) => {};

  const messageEndRef = useRef(null);

  const getDataDosenPA = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/datadosenpa");

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
      const response = await axios.get("http://localhost:3000/api/datakaprodi");

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

  const getDataDosenPaByMahasiswaID = async () => {
    try {
      const dataDosenPa = await axios.get(
        `http://localhost:3000/api/datadosenpa`
      );

      const dataMahasiswa = await axios.get(
        `http://localhost:3000/api/datamahasiswa`
      );

      const dataUserMahasiswa = dataMahasiswa.data.find(
        (data) => data.id === dataUser.id
      );

      const dosenPa = dataDosenPa.data.find(
        (data) => data.id === dataUserMahasiswa.dosen_pa_id
      );

      if (!dosenPa) {
        console.error("Dosen PA tidak ditemukan");
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }
      setUserDosenPA(dosenPa);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataChatPribadiByMahasiswaId = async () => {
    try {
      const dataChatPribadi = await axios.get(
        `http://localhost:3000/api/chatpribadi`
      );

      const dataChat = dataChatPribadi.data.find(
        (data) => data.mahasiswa_id === dataUser.id
      );

      if (!dataChat) {
        setIsMahasiswaChatting(false);
        setSelectedDataChatPribadi({});
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }
      setIsMahasiswaChatting(true);
      setSelectedDataChatPribadi(dataChat);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataDosenPAByDosenId = async () => {
    try {
      const dataDosenPA = await axios.get(
        "http://localhost:3000/api/datadosenpa"
      );

      const dosen = dataDosenPA.data.find(
        (data) => data.dosen_id == dataUser.id
      );

      if (!dosen) {
        console.error("Dosen tidak ditemukan");
        return;
      }

      setUserDosenPA(dosen);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataChatDosenPAByChatPribadiId = async () => {
    try {
      const dataChatDosenPA = await axios.get(
        `http://localhost:3000/api/chatdosenpa`
      );

      const dataChat = dataChatDosenPA.data.filter(
        (data) => data.chat_pribadi_id === selectedDataChatPribadi.id
      );

      console.log(dataChat);

      if (!dataChat) {
        setIsMahasiswaChatting(false);
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }
      setChatDosenPAData(dataChat);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataChatMahasiswaByChatPribadiId = async () => {
    try {
      const dataChatMahasiswa = await axios.get(
        `http://localhost:3000/api/chatmahasiswa`
      );

      const dataChat = dataChatMahasiswa.data.filter(
        (data) => data.chat_pribadi_id === selectedDataChatPribadi.id
      );

      console.log(dataChat);

      if (!dataChat) {
        setIsMahasiswaChatting(false);
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }
      setChatMahasiswaData(dataChat);
      setIsMahasiswaChatting(true);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (location.state) {
      setChatData((prev) => [...prev, location.state]);
    }
  }, []);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    const sortedChatData = [...chatData].sort(
      (a, b) => new Date(a.waktu_kirim) - new Date(b.waktu_kirim)
    );

    setSortedChatData(sortedChatData);
  }, [chatData]);

  useEffect(() => {
    const mahasiswaDataWithRole = chatMahasiswaData.map((item) => ({
      ...item,
      role: "Mahasiswa", // Menambahkan role mahasiswa
    }));

    const dosenPADataWithRole = chatDosenPAData.map((item) => ({
      ...item,
      role: "Dosen PA", // Menambahkan role dosen PA
    }));

    const combinedChatData = [...mahasiswaDataWithRole, ...dosenPADataWithRole];

    setChatData(combinedChatData);
  }, [chatMahasiswaData, chatDosenPAData]);

  console.log(chatMahasiswaData);
  console.log(chatDosenPAData);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("authToken="));
    if (authTokenCookie) {
      const token = authTokenCookie.split("=")[1];
      try {
        const decodedToken = jwtDecode(token);
        setDataUser(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
    getDataDosenPA();
    getDataKaprodi();
  }, []);

  useEffect(() => {
    getDataChatMahasiswaByChatPribadiId();
    getDataChatDosenPAByChatPribadiId();
  }, [isMahasiswaChatting, selectedDataChatPribadi]);

  useEffect(() => {
    if (dataUser && dataUser.id) {
      getDataDosenPAByDosenId();
      getDataDosenPaByMahasiswaID();
      getDataChatPribadiByMahasiswaId();
    }
  }, [dataUser]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  let previousDate = null;

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sortedChatData]);

  return (
    <div className="h-full">
      <NavbarChatbot />
      <div className="flex">
        <div className="flex flex-col h-screen w-full pt-[72px]">
          <div className="pl-4 flex border items-center">
            <Link href="/chatbot">
              <Image src={backIcon} className="size-8" alt="back-icon" />
            </Link>
            <HeaderChatbot namaDosenPA={userDosenPA?.dosen?.nama_lengkap} />
          </div>
          <div className="h-full overflow-y-scroll px-[40px] flex flex-col w-full justify-between gap-8">
            <div id="message-container" className="flex-1 w-full flex flex-col">
              {sortedChatData.map((data, index) => {
                const currentDate = formatDate(data.waktu_kirim);
                const showDateHeader = currentDate !== previousDate;
                previousDate = currentDate;

                return (
                  <React.Fragment key={index}>
                    {showDateHeader && (
                      <div className="text-center my-4 text-gray-500 text-sm">
                        {currentDate}
                      </div>
                    )}
                    {data.role === "Dosen PA" ? (
                      <BubbleChatStart key={index + "message"} data={data} />
                    ) : (
                      <BubbleChatEnd key={index + "message"} data={data} />
                    )}
                  </React.Fragment>
                );
              })}

              <div ref={messageEndRef} />
            </div>
          </div>
          <div className="px-10 py-4">
            <TextInputPesanMahasiswa
              handleAddChatMahasiswa={handleAddChatMahasiswa}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
