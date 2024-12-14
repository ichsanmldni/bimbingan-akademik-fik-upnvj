"use client";

import BubbleChatEnd from "@/components/ui/chatbot/BubbleChatEnd";
import BubbleChatStart from "@/components/ui/chatbot/BubbleChatStart";
import ChatbotHeader from "@/components/ui/chatbot/ChatbotHeader";
import LandingPageHeader from "@/components/ui/chatbot/ChatbotHeader";
import HeaderChatbot from "@/components/ui/chatbot/ChatDosenHeader";
import NavbarChatbot from "@/components/ui/chatbot/NavbarChatbot";
import SidebarChatbot from "@/components/ui/chatbot/SidebarChatbot";
import TextInputPesanChatbot from "@/components/ui/chatbot/TextInputPesanChatbot";
import TextInputPesanMahasiswa from "@/components/ui/chatbot/TextInputPesanMahasiswa";
import TextInput from "@/components/ui/chatbot/TextInputPesanMahasiswa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const id = uuidv4();
  const [roleUser, setRoleUser] = useState("");
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [dataKaprodi, setDataKaprodi] = useState([]);
  const [isMessageEnter, setIsMessageEnter] = useState(false);
  const [dataSesiChatbotMahasiswa, setDataSesiChatbotMahasiswa] = useState([]);
  const [dataChatbotMahasiswa, setDataChatbotMahasiswa] = useState([]);
  const [dataPesanBot, setDataPesanBot] = useState([]);
  const [chatbotData, setChatbotData] = useState([]);
  const [sortedChatbotData, setSortedChatbotData] = useState([]);
  const [dataUser, setDataUser] = useState({});
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  const API_BASE_URL = "http://localhost:3000/api";
  const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

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
  const messageEndRef = useRef(null);

  const [activeSesiChatbotMahasiswa, setActiveSesiChatbotMahasiswa] =
    useState("New Session");

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

  const getDataSesiChatbotMahasiswa = async () => {
    try {
      const dataSesiChatbotMahasiswa = await axios.get(
        `http://localhost:3000/api/sesichatbotmahasiswa`
      );
      setDataSesiChatbotMahasiswa(dataSesiChatbotMahasiswa.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataChatbotMahasiswabySesiChatbotMahasiswaID = async () => {
    try {
      const dataChatbotMahasiswa = await axios.get(
        `http://localhost:3000/api/chatbotmahasiswa`
      );

      const dataChatbotMahasiswaFiltered = dataChatbotMahasiswa.data.filter(
        (data) => data.sesi_chatbot_mahasiswa_id === activeSesiChatbotMahasiswa
      );
      setDataChatbotMahasiswa(dataChatbotMahasiswaFiltered);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataPesanBotBySesiChatbotMahasiswaID = async () => {
    try {
      const dataPesanBot = await axios.get(
        `http://localhost:3000/api/pesanbot`
      );

      const dataPesanBotFiltered = dataPesanBot.data.filter(
        (data) => data.sesi_chatbot_mahasiswa_id === activeSesiChatbotMahasiswa
      );
      setDataPesanBot(dataPesanBotFiltered);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getChatGPTResponse = async (userMessage) => {
    if (!userMessage) throw new Error("Pesan pengguna tidak boleh kosong.");

    try {
      const { data } = await axios.post(
        OPENAI_API_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Anda adalah asisten AI." },
            { role: "user", content: userMessage },
          ],
          max_tokens: 3000,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      return (
        data.choices[0]?.message?.content || "Tidak ada respons dari model."
      );
    } catch (error) {
      console.error("Error getting ChatGPT response:", error.message);
      throw new Error("Gagal mendapatkan respons dari ChatGPT.");
    }
  };

  const postData = async (url, payload) => {
    try {
      const { data } = await axios.post(url, payload);
      return data;
    } catch (error) {
      console.error(`Error posting to ${url}:`, error.message);
      throw new Error(`Gagal mengirim data ke ${url}.`);
    }
  };

  const addPesanBot = (newChat) =>
    postData(`${API_BASE_URL}/pesanbot`, newChat);

  // Fungsi untuk menambahkan chatbot mahasiswa
  const addChatbotMahasiswa = (newChat) =>
    postData(`${API_BASE_URL}/chatbotmahasiswa`, newChat);

  // Fungsi utama untuk menangani penambahan chatbot mahasiswa
  const handleAddChatChatbotMahasiswa = async (newData) => {
    if (!newData || !newData.pesan) {
      console.error("Data baru atau pesan tidak valid.");
      return;
    }

    try {
      if (activeSesiChatbotMahasiswa !== "New Session") {
        const newChat = {
          ...newData,
          sesi_chatbot_mahasiswa_id: activeSesiChatbotMahasiswa,
        };

        await addChatbotMahasiswa(newChat);

        const chatgptResponse = await getChatGPTResponse(newData.pesan);

        const newPesanBot = {
          sesi_chatbot_mahasiswa_id: activeSesiChatbotMahasiswa,
          pesan: chatgptResponse,
          waktu_kirim: new Date().toISOString(),
        };

        await addPesanBot(newPesanBot);

        getDataChatbotMahasiswabySesiChatbotMahasiswaID();
        getDataPesanBotBySesiChatbotMahasiswaID();
      } else {
        const newChat = {
          ...newData,
          mahasiswa_id: dataUser.id,
        };

        const result = await addChatbotMahasiswa(newChat);

        setActiveSesiChatbotMahasiswa(result.sesi_chatbot_mahasiswa_id);

        const chatgptResponse = await getChatGPTResponse(newData.pesan);
        console.log("Respons ChatGPT:", chatgptResponse);
      }
    } catch (error) {
      console.error("Error handling chatbot mahasiswa:", error.message);
    }
  };

  useEffect(() => {
    const sortedChatbotData = [...chatbotData].sort(
      (a, b) => new Date(a.waktu_kirim) - new Date(b.waktu_kirim)
    );

    setSortedChatbotData(sortedChatbotData);
  }, [chatbotData]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sortedChatbotData]); // Mengawasi perubahan pada chatData

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("authToken="));

    if (authTokenCookie) {
      const token = authTokenCookie.split("=")[1];
      try {
        const decodedToken = jwtDecode(token);
        setDataUser(decodedToken);

        if (decodedToken.role === "Mahasiswa") {
          setRoleUser("Mahasiswa");
        } else if (
          decodedToken.role === "Dosen" &&
          dataDosenPA.find((data) => data.dosen_id === decodedToken.id)
        ) {
          setRoleUser("Dosen PA");
        } else if (
          decodedToken.role === "Dosen" &&
          dataKaprodi.find((data) => data.dosen_id === decodedToken.id)
        ) {
          setRoleUser("Kaprodi");
        } else if (decodedToken.role === "Admin") {
          setRoleUser("Admin");
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [dataDosenPA, dataKaprodi]);

  useEffect(() => {
    const dataChatbotMahasiswaWithRole = dataChatbotMahasiswa.map((item) => ({
      ...item,
      role: "Mahasiswa",
    }));

    const dataPesanBotWithRole = dataPesanBot.map((item) => ({
      ...item,
      role: "Bot",
    }));

    const combinedChatData = [
      ...dataChatbotMahasiswaWithRole,
      ...dataPesanBotWithRole,
    ];

    setChatbotData(combinedChatData);
  }, [dataChatbotMahasiswa, dataPesanBot]);

  useEffect(() => {
    getDataDosenPA();
    getDataKaprodi();
    getDataSesiChatbotMahasiswa();
  }, []);

  console.log(chatbotData);

  useEffect(() => {
    getDataChatbotMahasiswabySesiChatbotMahasiswaID();
    getDataPesanBotBySesiChatbotMahasiswaID();
    getDataSesiChatbotMahasiswa();
  }, [activeSesiChatbotMahasiswa]);

  return (
    <div className="h-full">
      <NavbarChatbot isPathChatbot={true} />
      <div className="flex">
        <SidebarChatbot
          setActiveSesiChatbotMahasiswa={setActiveSesiChatbotMahasiswa}
          activeSesiChatbotMahasiswa={activeSesiChatbotMahasiswa}
          data={dataSesiChatbotMahasiswa}
        />
        <div className="flex flex-col h-screen w-full pt-[72px]">
          {sortedChatbotData.length === 0 ? (
            <div className="h-full px-[120px] flex items-center">
              <ChatbotHeader />
            </div>
          ) : (
            <div className="h-full overflow-y-scroll px-[40px] flex flex-col w-full justify-between gap-8">
              <div
                id="message-container"
                className="flex-1 w-full flex flex-col"
              >
                {sortedChatbotData.map((data, index) => {
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
                        <BubbleChatEnd key={index + "message"} data={data} />
                      ) : (
                        <BubbleChatStart key={index + "message"} data={data} />
                      )}
                    </React.Fragment>
                  );
                })}
                <div ref={messageEndRef} />
              </div>
            </div>
          )}
          <div className="px-10 py-4">
            <TextInputPesanChatbot
              handleAddChatChatbotMahasiswa={handleAddChatChatbotMahasiswa}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
