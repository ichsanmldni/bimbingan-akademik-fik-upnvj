"use client";

import ChatMahasiswaHeader from "@/components/ui/chatbot/ChatMahasiswaHeader";
import TextInputPesanDosenPA from "@/components/ui/chatbot/TextInputPesanDosenPA";
import backIcon from "../../../assets/images/back-icon-black.png";
import broadcastIcon from "../../../assets/images/broadcast-icon.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { MessageSquareText } from "lucide-react";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import MessageMahasiswa from "@/components/ui/chatbot/MessageMahasiswa";
import BubbleChatStart from "@/components/ui/chatbot/BubbleChatStart";
import BubbleChatEnd from "@/components/ui/chatbot/BubbleChatEnd";
import { env } from "process";
import TextInputPesanSiaran from "@/components/ui/chatbot/TextInputPesanSiaran";
import PesanSiaranHeader from "@/components/ui/chatbot/PesanSiaranHeader";

export default function ChatMahasiswa() {
  const [dataUser, setDataUser] = useState<any>({});
  const [dataDosenPA, setDataDosenPA] = useState([]);
  const [dataKaprodi, setDataKaprodi] = useState([]); // Adjust type as needed
  const [userDosenPA, setUserDosenPA] = useState(null);
  const [dataChatPribadi, setDataChatPribadi] = useState([]);
  const [dataPesanSiaran, setDataPesanSiaran] = useState([]);
  const [selectedDataChatPribadi, setSelectedDataChatPribadi] = useState<any>(
    {}
  );
  const [selectedDataPesanSiaran, setSelectedDataPesanSiaran] = useState<any>(
    {}
  );
  const [selectedDataPesanChatSiaran, setSelectedDataPesanChatSiaran] =
    useState<any>({});
  const [isDetailChatPribadiClicked, setIsDetailChatPribadiClicked] =
    useState<boolean>(false);
  const [isDetailPesanSiaranClicked, setIsDetailPesanSiaranClicked] =
    useState<boolean>(false);
  const [sortedChatData, setSortedChatData] = useState([]);
  const [sortedPesanSiaranData, setSortedPesanSiaranData] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [pesanChatSiaranData, setPesanChatSiaranData] = useState([]);
  const [chatMahasiswaData, setChatMahasiswaData] = useState([]);
  const [chatDosenPAData, setChatDosenPAData] = useState([]);
  const [dosenPAID, setDosenPAID] = useState();
  const [allPesanSiaran, setAllPesanSiaran] = useState([]);
  const [allPesanChatSiaran, setAllPesanChatSiaran] = useState([]);
  const [isDosenBroadcast, setIsDosenBroadcast] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const getDataDosenIDByNIP = async () => {
    const dataDosenPA = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

    const dosenPA = dataDosenPA.data.find((data) => data.nip === dataUser.nip);
    setDosenPAID(dosenPA.id);
  };

  const addChatDosenPA = async (newChat: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chatdosenpa`,
        newChat
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const addPesanChatSiaran = async (newChat: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/pesanchatsiaran`,
        newChat
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleClickDetailChatPribadi = (data: any) => {
    setSelectedDataChatPribadi(data);
    setIsDetailChatPribadiClicked(true);
    if (!data.is_dosenpa_pesan_terakhir_read) {
      handleEditChatPribadi(data);
    }
  };
  const handleClickDetailPesanSiaran = () => {
    getDataPesanChatSiaran();
    setIsDetailPesanSiaranClicked(true);
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sortedChatData, handleClickDetailChatPribadi]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sortedPesanSiaranData, handleClickDetailPesanSiaran]);

  const handleEditChatPribadi = async (data: any) => {
    const updatedData = {
      id: data.id,
    };

    try {
      const result = await patchChatPribadi(updatedData);
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  const handleAddChatDosenPA = async (newData: any) => {
    const newChat = {
      ...newData,
      chat_pribadi_id: selectedDataChatPribadi.id,
    };

    try {
      await addChatDosenPA(newChat);
      getDataChatDosenPABySelectedChatPribadiId();
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

  const handleAddPesanChatSiaran = async (newData: any) => {
    const newChat = {
      ...newData,
      pesan_siaran_id: selectedDataPesanSiaran.id || undefined,
    };

    try {
      await addPesanChatSiaran(newChat);
      getDataPesanSiaran();
      getDataPesanChatSiaranByDosenPAID();
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
    }
  };

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

  const getDataDosenPaByDosenID = async () => {
    try {
      const dataDosenPA = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

      const dosenPa = dataDosenPA.data.find((data) => data.id === dosenPAID);

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

  const patchChatPribadi = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/chatpribadi/updateisreaddosenpa`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const getDataChatPribadiByDosenPAID = async () => {
    try {
      const dataChatPribadi = await axios.get(
        `${API_BASE_URL}/api/chatpribadi`
      );

      const dataChat = dataChatPribadi.data.filter(
        (data) => data.dosen_pa_id === dosenPAID
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
  const getDataPesanSiaran = async () => {
    try {
      const dataPesanSiaran = await axios.get(
        `${API_BASE_URL}/api/pesansiaran`
      );

      const data = dataPesanSiaran.data;

      setAllPesanSiaran(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  const getDataPesanChatSiaran = async () => {
    try {
      const dataPesanChatSiaran = await axios.get(
        `${API_BASE_URL}/api/pesanchatsiaran`
      );

      const data = dataPesanChatSiaran.data;

      setAllPesanChatSiaran(data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  const getDataPesanSiaranByDosenPAID = async () => {
    try {
      const dataPesanSiaran = await axios.get(
        `${API_BASE_URL}/api/pesansiaran`
      );

      const dataSiaran = dataPesanSiaran.data.filter(
        (data) => data.dosen_pa_id === dosenPAID
      );

      if (!dataSiaran) {
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }

      setDataPesanSiaran(dataSiaran);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataChatDosenPABySelectedChatPribadiId = async () => {
    try {
      const dataChatDosenPA = await axios.get(
        `${API_BASE_URL}/api/chatdosenpa`
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

  const getDataPesanChatSiaranByDosenPAID = async () => {
    try {
      const dataPesanChatSiaran = await axios.get(
        `${API_BASE_URL}/api/pesanchatsiaran`
      );

      const dataSiaran = dataPesanChatSiaran.data.filter(
        (data) => data.pesan_siaran.dosen_pa_id === dosenPAID
      );

      if (!dataSiaran) {
        setIsDosenBroadcast(false);
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }
      setPesanChatSiaranData(dataSiaran);
      setIsDosenBroadcast(true);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const getDataChatMahasiswaBySelectedChatPribadiId = async () => {
    try {
      const dataChatMahasiswa = await axios.get(
        `${API_BASE_URL}/api/chatmahasiswa`
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
    getDataPesanSiaran();
    getDataPesanChatSiaran();
  }, []);

  useEffect(() => {
    if (allPesanChatSiaran && allPesanSiaran && userDosenPA) {
      const selectedDataPesanSiaran = allPesanSiaran.find(
        (data) => data.dosen_pa_id === userDosenPA.id
      );
      const selectedDataPesanChatSiaran = allPesanChatSiaran.find(
        (data) => data.pesan_siaran_id === selectedDataPesanSiaran.id
      );

      if (selectedDataPesanChatSiaran) {
        setSelectedDataPesanSiaran(selectedDataPesanSiaran);
        setSelectedDataPesanChatSiaran(selectedDataPesanChatSiaran);
      } else {
        setSelectedDataPesanSiaran({});
        setSelectedDataPesanChatSiaran({});
      }
    }
  }, [
    allPesanChatSiaran,
    allPesanSiaran,
    userDosenPA,
    isDetailPesanSiaranClicked,
    isDosenBroadcast,
  ]);

  useEffect(() => {
    if (dataUser && dataUser.nip) {
      getDataDosenIDByNIP();
    }
  }, [dataUser]);

  useEffect(() => {
    if (dosenPAID) {
      getDataDosenPaByDosenID();
      getDataChatPribadiByDosenPAID();
      getDataPesanSiaranByDosenPAID();
    }
  }, [dosenPAID]);

  useEffect(() => {
    getDataChatMahasiswaBySelectedChatPribadiId();
    getDataChatDosenPABySelectedChatPribadiId();
  }, [selectedDataChatPribadi]);

  useEffect(() => {
    if (dosenPAID) {
      getDataPesanChatSiaranByDosenPAID();
    }
  }, [selectedDataPesanSiaran]);

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
    const sortedChatData = [...chatData].sort(
      (a, b) =>
        new Date(a.waktu_kirim).getTime() - new Date(b.waktu_kirim).getTime()
    );

    setSortedChatData(sortedChatData);
  }, [chatData]);

  useEffect(() => {
    const sortedPesanSiaran = [...pesanChatSiaranData].sort(
      (a, b) =>
        new Date(a.waktu_kirim).getTime() - new Date(b.waktu_kirim).getTime()
    );

    setSortedPesanSiaranData(sortedPesanSiaran);
  }, [pesanChatSiaranData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  let previousDate: string | null = null;

  return (
    <div>
      <div className="flex">
        {!isDetailChatPribadiClicked && !isDetailPesanSiaranClicked ? (
          <div className="flex flex-col w-full h-[100vh] justify-start">
            <div className="flex gap-4 px-8 py-4 border justify-start items-center">
              <a href="/">
                <Image alt="back-icon" src={backIcon} />
              </a>
              <div className="p-3 rounded-full bg-orange-200">
                <MessageSquareText />
              </div>
              <p className="text-[20px] font-semibold">Pesan</p>
            </div>
            <div className="flex flex-col mb-4 overflow-y-auto h-[200%]">
              <div className="flex flex-col mt-6">
                <p className="mx-auto mb-6 text-sm text-gray-500 font-medium">
                  Pesan Siaran
                </p>
                <div
                  className={`flex px-4 md:px-[32px] rounded-xl mx-8 py-4 border justify-between items-center cursor-pointer`}
                  onClick={() => handleClickDetailPesanSiaran()}
                >
                  <div className="flex gap-4">
                    <div className="rounded-full flex size-12 justify-center items-center bg-orange-200">
                      <Image src={broadcastIcon} className="size-10" alt="" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className={`text-[14px] md:text-[18px] font-medium`}>
                        Pesan Siaran Mahasiswa Bimbingan
                      </p>
                      {selectedDataPesanSiaran.id && (
                        <p className="text-[14px] md:text-[16px]">
                          Anda: {selectedDataPesanSiaran.pesan_terakhir}
                        </p>
                      )}
                      {!selectedDataPesanSiaran.id && (
                        <p>
                          Anda belum memiliki pesan siaran satupun! silahkan
                          siarkan pesan.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {dataChatPribadi.length > 0 ? (
                <div className="flex flex-col mt-6">
                  <p className="mx-auto mb-6 text-sm text-gray-500 font-medium">
                    Pesan Pribadi
                  </p>
                  {dataChatPribadi.map((data) => (
                    <MessageMahasiswa
                      key={data.id}
                      onClick={() => handleClickDetailChatPribadi(data)}
                      data={data}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col mt-6">
                  <div className="text-center border rounded-xl text-sm font-medium text-gray-500 p-10 mx-8">
                    <svg
                      className="h-12 w-12 text-red-500 mx-auto mb-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <p>Belum ada pesan pribadi</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : !isDetailPesanSiaranClicked ? (
          <div className="flex flex-col h-screen w-full">
            <div className="pl-4 flex border items-center">
              <button
                onClick={() => {
                  setIsDetailChatPribadiClicked(false);
                  getDataChatPribadiByDosenPAID();
                }}
              >
                <Image alt="back-icon" src={backIcon} className="size-8" />
              </button>
              <ChatMahasiswaHeader data={selectedDataChatPribadi} />
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
        ) : !isDetailChatPribadiClicked ? (
          <div className="flex flex-col h-screen w-full">
            <div className="pl-4 flex border items-center">
              <button
                onClick={() => {
                  getDataPesanChatSiaran();
                  setIsDetailPesanSiaranClicked(false);
                }}
              >
                <Image alt="back-icon" src={backIcon} className="size-8" />
              </button>
              <PesanSiaranHeader />
            </div>
            <div className="h-full overflow-y-scroll px-[40px] flex flex-col w-full justify-between gap-8">
              <div
                id="message-container"
                className="flex-1 w-full flex flex-col"
              >
                {sortedPesanSiaranData.map((data, index) => {
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
                      <BubbleChatEnd key={index + "message"} data={data} />
                    </React.Fragment>
                  );
                })}
                <div ref={messageEndRef} />
              </div>
            </div>
            <div className="px-10 py-4">
              <TextInputPesanSiaran
                userDosenPA={userDosenPA}
                handleAddPesanChatSiaran={handleAddPesanChatSiaran}
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
