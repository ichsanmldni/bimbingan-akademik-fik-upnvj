"use client";

import BubbleChatEndChatbot from "@/components/ui/chatbot/BubbleChatEndChatbot";
import BubbleChatStartChatbot from "@/components/ui/chatbot/BubbleChatStartChatbot";
import ChatbotHeader from "@/components/ui/chatbot/ChatbotHeader";
import NavbarChatbot from "@/components/ui/chatbot/NavbarChatbot";
import SidebarChatbot from "@/components/ui/chatbot/SidebarChatbot";
import TextInputPesanChatbot from "@/components/ui/chatbot/TextInputPesanChatbot";
import { RootState } from "@/lib/store";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { env } from "process";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "@/components/ui/Spinner";

const selectIsLoadingGlobal = ({
  roleUser,
  dataUser,
  dataDosenPA,
  dataKaprodi,
  dataMahasiswa,
  dataJadwalDosenPA,
  dataSesiChatbotMahasiswa,
}) => {
  const isEmpty = (data) =>
    data === null ||
    data === undefined ||
    (Array.isArray(data) && data.length === 0) ||
    (typeof data === "object" &&
      !Array.isArray(data) &&
      Object.keys(data).length === 0) ||
    data === "";

  if (!roleUser) {
    console.log("Loading karena roleUser kosong:", roleUser);
    return true;
  }
  if (isEmpty(dataUser)) {
    console.log("Loading karena dataUser kosong:", dataUser);
    return true;
  }
  if (isEmpty(dataDosenPA)) {
    console.log("Loading karena dataDosenPA kosong:", dataDosenPA);
    return true;
  }
  if (isEmpty(dataKaprodi)) {
    console.log("Loading karena dataKaprodi kosong:", dataKaprodi);
    return true;
  }
  if (isEmpty(dataMahasiswa)) {
    console.log("Loading karena dataMahasiswa kosong:", dataMahasiswa);
    return true;
  }
  if (isEmpty(dataJadwalDosenPA)) {
    console.log("Loading karena dataJadwalDosenPA kosong:", dataJadwalDosenPA);
    return true;
  }
  if (isEmpty(dataSesiChatbotMahasiswa)) {
    console.log(
      "Loading karena dataSesiChatbotMahasiswa kosong:",
      dataSesiChatbotMahasiswa
    );
    return true;
  }

  return false;
};

export default function Home() {
  const [roleUser, setRoleUser] = useState<string>("");
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [dataKaprodi, setDataKaprodi] = useState<any[]>([]);
  const [dataMahasiswa, setDataMahasiswa] = useState<any[]>([]);
  const [dataSesiChatbotMahasiswa, setDataSesiChatbotMahasiswa] = useState<
    any[]
  >([]);
  const [dataChatbotMahasiswa, setDataChatbotMahasiswa] = useState([]);
  const [dataPesanBot, setDataPesanBot] = useState([]);
  const [dataRiwayatPesanChatbot, setDataRiwayatPesanChatbot] = useState([]);
  const [chatbotData, setChatbotData] = useState<any>([]);
  const [sortedChatbotData, setSortedChatbotData] = useState([]);
  const [dataDBCustomContext, setDataDBCustomContext] = useState([]);
  const dataUser = useSelector((state: RootState) => state.auth.dataUser);

  const [customDataConsumeGPT, setCustomDataConsumeGPT] = useState({
    dosen_pa: [],
    jadwal_kosong_semua_dosen_pa: [],
    informasi_akademik: [],
    custom_context: [],
  });
  const [dataJadwalDosenPA, setDataJadwalDosenPA] = useState([]);
  const [activeSesiChatbotMahasiswa, setActiveSesiChatbotMahasiswa] =
    useState(0);
  const [mahasiswaID, setMahasiswaID] = useState();
  const [dataInformasiAkademik, setDataInformasiAkademik] = useState([]);

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

  const getDataMahasiswa = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datamahasiswa`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      setDataMahasiswa(response.data);
    } catch (error) {
      throw error;
    }
  };

  const getDataDBCustomContext = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datacustomcontext`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      setDataDBCustomContext(response.data);
    } catch (error) {
      throw error;
    }
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
      throw error;
    }
  };

  const getDataJadwalDosenPA = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datajadwaldosenpa`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;
      setDataJadwalDosenPA(data);
    } catch (error) {
      throw error;
    }
  };

  const getDataInformasiAkademik = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datasubbab`);

      if (response.status !== 200) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.data;

      setDataInformasiAkademik(data.sort((a, b) => b.id - a.id));
    } catch (error) {
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
      throw error;
    }
  };

  const getDataSesiChatbotMahasiswa = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/sesichatbotmahasiswa`
      );

      const filteredDataSesiChatbot = response.data.filter(
        (data) => data.mahasiswa_id === mahasiswaID
      );
      setDataSesiChatbotMahasiswa(filteredDataSesiChatbot);
    } catch (error) {
      throw error;
    }
  };

  const getDataChatbotMahasiswabySesiChatbotMahasiswaID = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chatbotmahasiswa`);

      const dataChatbotMahasiswaFiltered = response.data.filter(
        (data: any) =>
          data.sesi_chatbot_mahasiswa_id === activeSesiChatbotMahasiswa
      );
      setDataChatbotMahasiswa(dataChatbotMahasiswaFiltered);
    } catch (error) {
      throw error;
    }
  };

  const getDataPesanBotBySesiChatbotMahasiswaID = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/pesanbot`);

      const dataPesanBotFiltered = response.data.filter(
        (data: any) =>
          data.sesi_chatbot_mahasiswa_id === activeSesiChatbotMahasiswa
      );
      setDataPesanBot(dataPesanBotFiltered);
    } catch (error) {
      throw error;
    }
  };

  const getDataRiwayatPesanChatbotBySesiChatbotMahasiswaID = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/riwayatpesanchatbot`
      );

      const dataRiwayatPesanChatbotFiltered = response.data.filter(
        (data: any) =>
          data.sesi_chatbot_mahasiswa_id === activeSesiChatbotMahasiswa
      );
      setDataRiwayatPesanChatbot(dataRiwayatPesanChatbotFiltered);
    } catch (error) {
      throw error;
    }
  };

  console.log(dataUser);

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

  useEffect(() => {
    if (
      dataDosenPA &&
      dataJadwalDosenPA &&
      dataInformasiAkademik &&
      dataDBCustomContext
    ) {
      const customContext = dataDBCustomContext.reduce((acc, curr) => {
        acc[curr.judul] = curr.isi; // Set `judul` sebagai key dan `isi` sebagai value
        return acc;
      }, {});

      setCustomDataConsumeGPT({
        dosen_pa: dataDosenPA.map((dosen) => ({
          nama: dosen.nama,
          email: dosen.email,
          hp: dosen.hp,
        })),
        jadwal_kosong_semua_dosen_pa: dataJadwalDosenPA.map((jadwal) => ({
          dosen_id: jadwal.dosen_pa_id,
          jadwal: [
            {
              hari: jadwal.hari,
              jam: `${jadwal.jam_mulai} - ${jadwal.jam_selesai}`,
            },
          ],
        })),
        informasi_akademik: dataInformasiAkademik.map((info) => ({
          judul: info.nama,
          deskripsi: info.isi,
        })),
        custom_context: customContext, // Masukkan hasil konversi ke properti baru
      });
    }
  }, [
    dataDosenPA,
    dataJadwalDosenPA,
    dataInformasiAkademik,
    dataDBCustomContext,
  ]);

  const getChatGPTResponse = async (sesiId, userMessage) => {
    if (!userMessage) throw new Error("Pesan pengguna tidak boleh kosong.");

    if (!customDataConsumeGPT) throw new Error("Data belum tersedia.");

    const maxInfoCount = 13; // Maksimal jumlah informasi akademik

    const dosenList = customDataConsumeGPT.dosen_pa
      .map(
        (dosen) =>
          `Dosen: ${dosen.nama}, Email: ${dosen.email}, Telepon: ${dosen.hp}`
      )
      .join("\n");

    const jadwalKosong = customDataConsumeGPT.jadwal_kosong_semua_dosen_pa
      .map(
        (jadwal) =>
          `Dosen ID: ${jadwal.dosen_id}, Jadwal: ${jadwal.jadwal
            .map((j) => `${j.hari}: ${j.jam}`)
            .join(", ")}`
      )
      .join("\n");

    const dbCustomContext = Object.entries(customDataConsumeGPT.custom_context)
      .map(([judul, isi]) => `${judul}: ${isi}`)
      .join("\n");

    const informasiAkademik = customDataConsumeGPT.informasi_akademik
      .slice(0, maxInfoCount) // Batasi jumlah elemen
      .map((info) => `Judul: ${info.judul}, Deskripsi: ${info.deskripsi}`)
      .join("\n");

    const customContext = `
  Berikut adalah informasi penting untuk pengetahuan kamu sebelum menjawab pertanyaannya:
  
  Dosen Pembimbing Akademik:
  ${dosenList}

  Jadwal Kosong Dosen:
  ${jadwalKosong}

${dbCustomContext}

  Informasi Akademik (terbatas ${maxInfoCount} data):
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
              content: `Anda adalah asisten AI. ${customContext}`,
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
      throw new Error("Gagal mendapatkan respons dari ChatGPT.");
    }
  };

  const postData = async (url: string, payload: any) => {
    try {
      const { data } = await axios.post(url, payload);
      return data;
    } catch (error) {
      throw new Error(`Gagal mengirim data ke ${url}.`);
    }
  };

  const addPesanBot = (newChat: any) =>
    postData(`${API_BASE_URL}/api/pesanbot`, newChat);

  const addChatbotMahasiswa = (newChat: any) =>
    postData(`${API_BASE_URL}/api/chatbotmahasiswa`, newChat);

  const handleAddChatChatbotMahasiswa = async (newData: any) => {
    if (!newData || !newData.pesan) {
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
        setIsNewChat(true);
        const newChat = {
          ...newData,
          mahasiswa_id: mahasiswaID,
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
        setIsNewChat(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const sortedChatbotData: any = [...chatbotData].sort(
      (a: any, b: any) =>
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
    if (dataUser && dataUser.nim && dataMahasiswa && dataMahasiswa.length > 0) {
      const mahasiswa: any = dataMahasiswa.find(
        (data: any) => data.nim === dataUser.nim
      );
      setMahasiswaID(mahasiswa?.id);
    }
  }, [dataMahasiswa, dataUser]);

  useEffect(() => {
    const dataChatbotMahasiswaWithRole = dataChatbotMahasiswa.map(
      (item: any) => ({
        ...item,
        role: "Mahasiswa",
      })
    );

    const dataPesanBotWithRole = dataPesanBot.map((item: any) => ({
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
    getDataMahasiswa();
    getDataJadwalDosenPA();
    getDataInformasiAkademik();
    getDataDBCustomContext();
  }, []);

  useEffect(() => {
    getDataSesiChatbotMahasiswa();
  }, [mahasiswaID]);

  useEffect(() => {
    getDataChatbotMahasiswabySesiChatbotMahasiswaID();
    getDataPesanBotBySesiChatbotMahasiswaID();
    getDataRiwayatPesanChatbotBySesiChatbotMahasiswaID();
  }, [activeSesiChatbotMahasiswa]);

  const [isOpen, setIsOpen] = useState(false);
  const [isNewChat, setIsNewChat] = useState(false);

  useEffect(() => {
    if (isNewChat === true) {
      getDataSesiChatbotMahasiswa();
    }
  }, [isNewChat]);

  // Status states
  const statusDataMahasiswa = useSelector(
    (state: RootState) => state.mahasiswa?.status
  );
  const statusDataDosenPA = useSelector(
    (state: RootState) => state.dosenPA?.status
  );
  const statusDataKaprodi = useSelector(
    (state: RootState) => state.kaprodi?.status
  );
  const statusDataUser = useSelector((state: RootState) => state.user?.status);

  const userData = useMemo(() => {
    if (!dataUser) return null;

    if (roleUser === "Mahasiswa" && statusDataMahasiswa === "succeeded") {
      return dataMahasiswa.find((data) => data.nim === dataUser?.nim) || null;
    }
    if (roleUser === "Dosen PA" && statusDataDosenPA === "succeeded") {
      return dataDosenPA.find((data) => data.email === dataUser?.email) || null;
    }
    if (roleUser === "Kaprodi" && statusDataKaprodi === "succeeded") {
      return dataKaprodi.find((data) => data.email === dataUser?.email) || null;
    }
    return null;
  }, [
    roleUser,
    dataUser,
    dataMahasiswa,
    dataDosenPA,
    dataKaprodi,
    statusDataMahasiswa,
    statusDataDosenPA,
    statusDataKaprodi,
  ]);

  const isLoading = selectIsLoadingGlobal({
    roleUser,
    dataUser,
    dataDosenPA,
    dataKaprodi,
    dataMahasiswa,
    dataJadwalDosenPA,
    dataSesiChatbotMahasiswa,
  });

  return (
    <>
      {isLoading && <Spinner />}
      <div className="h-screen relative">
        <NavbarChatbot
          isPathChatbot={true}
          roleUser={roleUser}
          dataUser={userData}
        />
        {userData?.status_lulus === true ? (
          <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md px-4 py-3 mx-4 md:mx-8 mt-4 md:mt-[96px] mb-4 text-sm md:text-base">
            Anda telah lulus dan tidak lagi terdaftar sebagai mahasiswa
            bimbingan. Oleh karena itu, fitur{" "}
            <strong>Chatbot Bimbingan Akademik</strong> tidak tersedia.
          </div>
        ) : (
          <div className="flex h-screen">
            {/* Sidebar */}
            {isOpen && (
              <div
                className="fixed inset-0 bg-black/50 md:hidden z-[100]"
                onClick={() => setIsOpen(false)}
              />
            )}
            <div
              className={`fixed h-screen inset-0 md:relative w-[200px] md:w-[270px] bg-white shadow-md transition-transform duration-300 
    ${isOpen ? "translate-x-0 z-[999]" : "-translate-x-full"} md:translate-x-0`}
            >
              <SidebarChatbot
                setActiveSesiChatbotMahasiswa={setActiveSesiChatbotMahasiswa}
                activeSesiChatbotMahasiswa={activeSesiChatbotMahasiswa}
                data={dataSesiChatbotMahasiswa}
                setIsOpen={setIsOpen}
              />
            </div>

            {/* Main Chat Area */}
            <div
              className={`flex flex-col flex-1 min-h-screen w-full pt-[72px] ${isOpen ? "md:pl-[200px]" : "ml-0"} transition-all duration-300`}
            >
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden p-2 text-gray-700 focus:outline-none"
                >
                  <svg
                    className={`w-6 h-6 ${isOpen ? "hidden" : "block"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                  <svg
                    className={`w-6 h-6 ${isOpen ? "block" : "hidden"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {sortedChatbotData.length === 0 ? (
                <div className="flex-1 px-20 md:px-[120px] flex items-center">
                  <ChatbotHeader />
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto px-[40px] flex flex-col w-full justify-between gap-8">
                  <div
                    id="message-container"
                    className="flex-1 w-full flex flex-col"
                  >
                    {sortedChatbotData.map((data: any, index) => (
                      <React.Fragment key={index}>
                        {data.role === "Mahasiswa" ? (
                          <BubbleChatEndChatbot
                            key={index + "message"}
                            data={data}
                          />
                        ) : (
                          <BubbleChatStartChatbot
                            key={index + "message"}
                            data={data}
                          />
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
        )}
      </div>
    </>
  );
}
