"use client";
import BubbleChat from "@/components/ui/chatbot/BubbleChatStart";
import ChatMahasiswaHeader from "@/components/ui/chatbot/ChatMahasiswaHeader";
import NavbarChatbot from "@/components/ui/chatbot/NavbarChatbot";
import SidebarChatbot from "@/components/ui/chatbot/SidebarChatbot";
import TextInputPesanDosenPA from "@/components/ui/chatbot/TextInputPesanDosenPA";
import backIcon from "../../../assets/images/back-icon-black.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { MessageSquareText, Sidebar } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MessageMahasiswa from "@/components/ui/chatbot/MessageMahasiswa";
import BubbleChatStart from "@/components/ui/chatbot/BubbleChatStart";
import BubbleChatEnd from "@/components/ui/chatbot/BubbleChatEnd";
import { div } from "framer-motion/client";

export default function ChatMahasiswa() {
  const [dataUser, setDataUser] = useState({});
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [dataKaprodi, setDataKaprodi] = useState([]);
  const [userDosenPA, setUserDosenPA] = useState({});
  const [dataChatPribadi, setDataChatPribadi] = useState([]);
  const [selectedDataChatPribadi, setSelectedDataChatPribadi] = useState({});
  const [isDetailChatClicked, setIsDetailChatClicked] = useState(false);
  const [sortedChatData, setSortedChatData] = useState([]);

  useEffect(() => {
    if (location.state) {
      setChatData((prev) => [...prev, location.state]);
    }
  }, []);

  const [chatData, setChatData] = useState([]);
  const [chatMahasiswaData, setChatMahasiswaData] = useState([]);
  const [chatDosenPAData, setChatDosenPAData] = useState([]);

  const addChatDosenPA = async (newChat) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/chatdosenpa",
        newChat
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  console.log(sortedChatData);

  const handleAddChatDosenPA = async (newData) => {
    const newChat = {
      ...newData,
      chat_pribadi_id: selectedDataChatPribadi.id,
    };

    try {
      const result = await addChatDosenPA(newChat);
      getDataChatMahasiswaBySelectedChatPribadiId();
      getDataChatDosenPABySelectedChatPribadiId();
    } catch (error) {
      console.error("Registration error:", error.message);
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

  const getDataChatPribadiByDosenPAId = async () => {
    try {
      const dataChatPribadi = await axios.get(
        `http://localhost:3000/api/chatpribadi`
      );

      const dataChat = dataChatPribadi.data.filter(
        (data) => data.dosen_pa_id === userDosenPA.id
      );

      if (!dataChat) {
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }

      setDataChatPribadi(dataChat);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataChatDosenPABySelectedChatPribadiId = async () => {
    try {
      const dataChatDosenPA = await axios.get(
        `http://localhost:3000/api/chatdosenpa`
      );

      const dataChat = dataChatDosenPA.data.filter(
        (data) => data.chat_pribadi_id === selectedDataChatPribadi.id
      );

      if (!dataChat) {
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }
      setChatDosenPAData(dataChat);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataChatMahasiswaBySelectedChatPribadiId = async () => {
    try {
      const dataChatMahasiswa = await axios.get(
        `http://localhost:3000/api/chatmahasiswa`
      );

      const dataChat = dataChatMahasiswa.data.filter(
        (data) => data.chat_pribadi_id === selectedDataChatPribadi.id
      );

      if (!dataChat) {
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }
      setChatMahasiswaData(dataChat);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

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

  const patchChatPribadi = async (updatedData) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/chatpribadi/updateisread",
        updatedData
      );
      console.log(updatedData);
      console.log("Dosen PA updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleEditChatPribadi = async (data) => {
    const updatedData = {
      id: data.id,
    };

    try {
      const result = await patchChatPribadi(updatedData);
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  useEffect(() => {
    getDataChatMahasiswaBySelectedChatPribadiId();
    getDataChatDosenPABySelectedChatPribadiId();
  }, [selectedDataChatPribadi]);

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

  useEffect(() => {
    if (userDosenPA && userDosenPA.id) {
      getDataChatPribadiByDosenPAId();
    }
  }, [userDosenPA]);

  useEffect(() => {
    if (dataUser && dataUser.id) {
      getDataDosenPAByDosenId();
      getDataDosenPaByMahasiswaID();
    }
  }, [dataUser]);

  const handleClickDetailChat = (data) => {
    setSelectedDataChatPribadi(data);
    setIsDetailChatClicked(true);
    if (!data.is_pesan_terakhir_read) {
      handleEditChatPribadi(data);
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sortedChatData]);

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

  return (
    <div>
      <div className="flex">
        {!isDetailChatClicked ? (
          <div className="flex flex-col w-full h-[100vh] justify-start">
            <div className="flex gap-4 px-8 py-4 border justify-start items-center">
              <a href="/">
                <Image alt="back-icon" src={backIcon} />
              </a>
              <div className="p-3 rounded-full bg-orange-200">
                <MessageSquareText />
              </div>
              <p className="text-[24px] font-semibold">Pesan</p>
            </div>
            <div className="flex flex-col mb-4 overflow-y-auto h-[200%]">
              {dataChatPribadi.length > 0 ? (
                dataChatPribadi.map((data) => (
                  <MessageMahasiswa
                    key={data.id}
                    onClick={() => handleClickDetailChat(data)}
                    data={data}
                  />
                ))
              ) : (
                <div className="text-center mt-10 border rounded-lg p-10 mx-10">
                  <p>Belum ada chat</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-screen w-full">
            <div className="pl-4 flex border items-center">
              <button
                onClick={() => {
                  setIsDetailChatClicked(false);
                  getDataChatPribadiByDosenPAId();
                }}
              >
                <Image alt="back-icon" src={backIcon} className="size-8" />
              </button>
              <ChatMahasiswaHeader
                namaMahasiswa={selectedDataChatPribadi.mahasiswa.nama_lengkap}
              />
            </div>
            <div className="h-full overflow-y-scroll px-[40px] flex flex-col w-full justify-between gap-8">
              <div
                id="message-container"
                className="flex-1 w-full flex flex-col"
              >
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
                      {data.role === "Mahasiswa" ? (
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
              <TextInputPesanDosenPA
                handleAddChatDosenPA={handleAddChatDosenPA}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
