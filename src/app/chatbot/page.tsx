"use client";

import BubbleChatEnd from "@/components/ui/chatbot/BubbleChatEnd";
import BubbleChatStart from "@/components/ui/chatbot/BubbleChatStart";
import ChatbotHeader from "@/components/ui/chatbot/ChatbotHeader";
import NavbarChatbot from "@/components/ui/chatbot/NavbarChatbot";
import SidebarChatbot from "@/components/ui/chatbot/SidebarChatbot";
import TextInputPesanChatbot from "@/components/ui/chatbot/TextInputPesanChatbot";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { env } from "process";
import React, { useEffect, useRef, useState } from "react";

interface User {
  id: number;
  role: string;
  // Add other user properties as needed
}

interface ChatMessageBot {
  sesi_chatbot_mahasiswa_id: number;
  pesan: string;
  waktu_kirim: string; // Adjust type according to your schema
}

interface ChatMessageMahasiswa {
  sesi_chatbot_mahasiswa_id: number;
  pesan: string;
  waktu_kirim: string; // Adjust type according to your schema
}

interface RiwayatPesanChatbot {
  sesi_chatbot_mahasiswa_id: number;
  pesan: string;
  role: string;
  waktu_kirim: string; // Adjust type according to your schema
}

interface PesanChatbot {
  sesi_chatbot_mahasiswa_id: number;
  pesan: string;
  role: string;
  waktu_kirim: string; // Adjust type according to your schema
}

interface DosenPA {
  dosen_id: number;
  name: string;
  email: string;
  phone: string;
}

interface JadwalKosong {
  dosen_id: number;
  jadwal: { hari: string; jam: string }[];
}

interface InformasiAkademik {
  id: number;
  judul: string;
  deskripsi: string;
}

export default function Home() {
  const [roleUser, setRoleUser] = useState<string>("");
  const [dataDosenPA, setDataDosenPA] = useState<DosenPA[]>([]);
  const [dataKaprodi, setDataKaprodi] = useState<any[]>([]);
  const [dataSesiChatbotMahasiswa, setDataSesiChatbotMahasiswa] = useState<
    any[]
  >([]);
  const [dataChatbotMahasiswa, setDataChatbotMahasiswa] = useState<
    ChatMessageMahasiswa[]
  >([]);
  const [dataPesanBot, setDataPesanBot] = useState<ChatMessageBot[]>([]);
  const [dataRiwayatPesanChatbot, setDataRiwayatPesanChatbot] = useState<
    RiwayatPesanChatbot[]
  >([]);
  const [chatbotData, setChatbotData] = useState<PesanChatbot[]>([]);
  const [sortedChatbotData, setSortedChatbotData] = useState<PesanChatbot[]>(
    []
  );
  const [dataUser, setDataUser] = useState<User | null>(null);
  const [customDataConsumeGPT, setCustomDataConsumeGPT] = useState<{
    dosen_pa: DosenPA[];
    jadwal_kosong_semua_dosen_pa: JadwalKosong[];
    jadwal_kosong_dosen_pa_user: JadwalKosong;
    informasi_akademik: InformasiAkademik[];
  }>({
    dosen_pa: [],
    jadwal_kosong_semua_dosen_pa: [],
    jadwal_kosong_dosen_pa_user: { dosen_id: 0, jadwal: [] },
    informasi_akademik: [],
  });
  const [activeSesiChatbotMahasiswa, setActiveSesiChatbotMahasiswa] =
    useState<number>(0);

  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const messageEndRef = useRef<HTMLDivElement | null>(null);

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

  const getDataSesiChatbotMahasiswa = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/sesichatbotmahasiswa`
      );
      setDataSesiChatbotMahasiswa(response.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataChatbotMahasiswabySesiChatbotMahasiswaID = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chatbotmahasiswa`);

      const dataChatbotMahasiswaFiltered = response.data.filter(
        (data: PesanChatbot) =>
          data.sesi_chatbot_mahasiswa_id === activeSesiChatbotMahasiswa
      );
      setDataChatbotMahasiswa(dataChatbotMahasiswaFiltered);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataPesanBotBySesiChatbotMahasiswaID = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/pesanbot`);

      const dataPesanBotFiltered = response.data.filter(
        (data: PesanChatbot) =>
          data.sesi_chatbot_mahasiswa_id === activeSesiChatbotMahasiswa
      );
      setDataPesanBot(dataPesanBotFiltered);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataRiwayatPesanChatbotBySesiChatbotMahasiswaID = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/riwayatpesanchatbot`
      );

      const dataRiwayatPesanChatbotFiltered = response.data.filter(
        (data: RiwayatPesanChatbot) =>
          data.sesi_chatbot_mahasiswa_id === activeSesiChatbotMahasiswa
      );
      setDataRiwayatPesanChatbot(dataRiwayatPesanChatbotFiltered);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getChatGPTResponse = async (sesiId: number, userMessage: string) => {
    if (!userMessage) throw new Error("Pesan pengguna tidak boleh kosong.");

    const dosenList = customDataConsumeGPT.dosen_pa
      .map(
        (dosen) =>
          `Dosen: ${dosen.name}, Email: ${dosen.email}, Telepon: ${dosen.phone}`
      )
      .join("\n");

    const jadwalKosong = customDataConsumeGPT.jadwal_kosong_semua_dosen_pa
      .map(
        (jadwal) =>
          `Dosen ID: ${jadwal.dosen_id}, Jadwal: ${jadwal.jadwal.map((j) => `${j.hari}: ${j.jam}`).join(", ")}`
      )
      .join("\n");

    const informasiAkademik = customDataConsumeGPT.informasi_akademik
      .map((info) => `Judul: ${info.judul}, Deskripsi: ${info.deskripsi}`)
      .join("\n");

    const customContext = `
      Berikut adalah informasi penting: untuk pengetahuan kamu sebelum menjawab pertanyaannya
      
      Dosen Pembimbing Akademik:
      ${dosenList}

      Jadwal Kosong Dosen:
      ${jadwalKosong}

      Informasi Akademik:
      ${informasiAkademik}
    `;

    const filteredMessages = dataRiwayatPesanChatbot
      .slice(-10)
      .map(({ role, pesan }) => ({
        role,
        content: pesan,
      }));

    filteredMessages.push({
      role: "user",
      content: userMessage,
    });

    try {
      const { data } = await axios.post(
        OPENAI_API_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `Anda adalah asisten ai, ${customContext}`,
            },
            ...filteredMessages,
          ],
          max_tokens: 4000,
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
      console.error(
        "Error getting ChatGPT response:",
        (error as Error).message
      );
      throw new Error("Gagal mendapatkan respons dari ChatGPT.");
    }
  };

  const postData = async (url: string, payload: any) => {
    try {
      const { data } = await axios.post(url, payload);
      return data;
    } catch (error) {
      console.error(`Error posting to ${url}:`, (error as Error).message);
      throw new Error(`Gagal mengirim data ke ${url}.`);
    }
  };

  const addPesanBot = (newChat: ChatMessageBot) =>
    postData(`${API_BASE_URL}/api/pesanbot`, newChat);

  const addChatbotMahasiswa = (newChat: ChatMessageMahasiswa) =>
    postData(`${API_BASE_URL}/api/chatbotmahasiswa`, newChat);

  const handleAddChatChatbotMahasiswa = async (
    newData: ChatMessageMahasiswa
  ) => {
    if (!newData || !newData.pesan) {
      console.error("Data baru atau pesan tidak valid.");
      return;
    }

    try {
      if (activeSesiChatbotMahasiswa !== 0) {
        const newChat = {
          ...newData,
          sesi_chatbot_mahasiswa_id: activeSesiChatbotMahasiswa,
        };

        await addChatbotMahasiswa(newChat);

        const chatgptResponse = await getChatGPTResponse(
          activeSesiChatbotMahasiswa,
          newData.pesan
        );

        const newPesanBot = {
          sesi_chatbot_mahasiswa_id: activeSesiChatbotMahasiswa,
          pesan: chatgptResponse,
          waktu_kirim: new Date().toISOString(),
        };

        await addPesanBot(newPesanBot);

        getDataChatbotMahasiswabySesiChatbotMahasiswaID();
        getDataPesanBotBySesiChatbotMahasiswaID();
        getDataRiwayatPesanChatbotBySesiChatbotMahasiswaID();
      } else {
        const newChat = {
          ...newData,
          mahasiswa_id: dataUser?.id,
        };

        const result = await addChatbotMahasiswa(newChat);

        const chatgptResponse = await getChatGPTResponse(
          result.sesi_chatbot_mahasiswa_id,
          newData.pesan
        );

        const newPesanBot = {
          sesi_chatbot_mahasiswa_id: result.sesi_chatbot_mahasiswa_id,
          pesan: chatgptResponse,
          waktu_kirim: new Date().toISOString(),
        };

        await addPesanBot(newPesanBot);

        setActiveSesiChatbotMahasiswa(result.sesi_chatbot_mahasiswa_id);
      }
    } catch (error) {
      console.error(
        "Error handling chatbot mahasiswa:",
        (error as Error).message
      );
    }
  };

  useEffect(() => {
    const sortedChatbotData = [...chatbotData].sort(
      (a, b) =>
        new Date(a.waktu_kirim).getTime() - new Date(b.waktu_kirim).getTime()
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
        const decodedToken = jwtDecode<User>(token);
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

  useEffect(() => {
    getDataChatbotMahasiswabySesiChatbotMahasiswaID();
    getDataPesanBotBySesiChatbotMahasiswaID();
    getDataRiwayatPesanChatbotBySesiChatbotMahasiswaID();
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
                {sortedChatbotData.map((data, index) => (
                  <React.Fragment key={index}>
                    {data.role === "Mahasiswa" ? (
                      <BubbleChatEnd key={index + "message"} data={data} />
                    ) : (
                      <BubbleChatStart key={index + "message"} data={data} />
                    )}
                  </React.Fragment>
                ))}
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
