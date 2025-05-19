"use client";

import ChatMahasiswaHeader from "@/components/ui/chatbot/ChatMahasiswaHeader";
import TextInputPesanDosenPA from "@/components/ui/TextInputPesanDosenPA";
import backIcon from "../../../assets/images/back-icon-black.png";
import broadcastIcon from "../../../assets/images/broadcast-icon.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { MessageSquareText } from "lucide-react";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MessageMahasiswa from "@/components/ui/chatbot/MessageMahasiswa";
import BubbleChatStart from "@/components/ui/BubbleChatStart";
import BubbleChatEnd from "@/components/ui/BubbleChatEnd";
import { env } from "process";
import TextInputPesanSiaran from "@/components/ui/TextInputPesanSiaran";
import PesanSiaranHeader from "@/components/ui/chatbot/PesanSiaranHeader";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export const selectIsLoadingGlobal = ({
  userDosenPA,
  dataChatPribadi,
  dataPesanSiaran,
  selectedDataChatPribadi,
  selectedDataPesanSiaran,
  selectedDataPesanChatSiaran,
  sortedChatData,
  sortedPesanSiaranData,
  chatData,
  pesanChatSiaranData,
  chatMahasiswaData,
  chatDosenPAData,
  allPesanSiaran,
  allPesanChatSiaran,
}: {
  userDosenPA: any;
  dataChatPribadi: any[];
  dataPesanSiaran: any[];
  selectedDataChatPribadi: any;
  selectedDataPesanSiaran: any;
  selectedDataPesanChatSiaran: any;
  sortedChatData: any[];
  sortedPesanSiaranData: any[];
  chatData: any[];
  pesanChatSiaranData: any[];
  chatMahasiswaData: any[];
  chatDosenPAData: any[];
  allPesanSiaran: any[];
  allPesanChatSiaran: any[];
}) => {
  const isStillLoading = (label: string, data: any) => {
    const loading = data === null || data === undefined;
    if (loading) {
      console.log(`[isLoading] ${label} is still loading`);
    }
    return loading;
  };

  // Tambahkan pengecekan loading hanya untuk data yang seharusnya async
  if (isStillLoading("userDosenPA", userDosenPA)) return true;
  if (isStillLoading("dataChatPribadi", dataChatPribadi)) return true;
  if (isStillLoading("dataPesanSiaran", dataPesanSiaran)) return true;
  if (isStillLoading("sortedChatData", sortedChatData)) return true;
  if (isStillLoading("sortedPesanSiaranData", sortedPesanSiaranData))
    return true;
  if (isStillLoading("chatData", chatData)) return true;
  if (isStillLoading("pesanChatSiaranData", pesanChatSiaranData)) return true;
  if (isStillLoading("chatMahasiswaData", chatMahasiswaData)) return true;
  if (isStillLoading("chatDosenPAData", chatDosenPAData)) return true;
  if (isStillLoading("allPesanSiaran", allPesanSiaran)) return true;
  if (isStillLoading("allPesanChatSiaran", allPesanChatSiaran)) return true;

  // Tidak loading, aman
  return false;
};

export function Spinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[1000]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-b-transparent"></div>
    </div>
  );
}

export default function ChatMahasiswa() {
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

  const roleUser = useSelector((state: RootState) => state.auth.roleUser) || "";
  const dataUser = useSelector((state: RootState) => state.auth.dataUser);
  const statusAuthUser = useSelector((state: RootState) => state.auth.status);

  // Data states
  const dataMahasiswa = useSelector((state: RootState) => state.mahasiswa.data);
  const dataDosenPA = useSelector((state: RootState) => state.dosenPA.data);
  const dataKaprodi = useSelector((state: RootState) => state.kaprodi.data);

  // Status states
  const statusDataMahasiswa = useSelector(
    (state: RootState) => state.mahasiswa.status
  );
  const statusDataDosenPA = useSelector(
    (state: RootState) => state.dosenPA.status
  );
  const statusDataKaprodi = useSelector(
    (state: RootState) => state.kaprodi.status
  );
  const statusDataUser = useSelector((state: RootState) => state.user.status);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const getDataDosenIDByEmail = async () => {
    const dataDosenPA = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

    const dosenPA = dataDosenPA.data.find(
      (data) => data.email === dataUser.email
    );
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
      await patchChatPribadi(updatedData);
    } catch (error) {}
  };

  const handleAddChatDosenPA = async (newData: any) => {
    const newChat = {
      ...newData,
      chat_pribadi_id: selectedDataChatPribadi.id,
    };

    try {
      await addChatDosenPA(newChat);
      getDataChatDosenPABySelectedChatPribadiId();
    } catch (error) {}
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
    } catch (error) {}
  };

  const getDataDosenPaByDosenID = async () => {
    try {
      const dataDosenPA = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

      const dosenPa = dataDosenPA.data.find((data) => data.id === dosenPAID);

      if (!dosenPa) {
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }
      setUserDosenPA(dosenPa);
    } catch (error) {
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
      throw error;
    }
  };

  const getDataChatPribadiByDosenPAID = async () => {
    try {
      const dataChatPribadi = await axios.get(
        `${API_BASE_URL}/api/chatpribadi`
      );

      const dataChat = dataChatPribadi.data
        .filter((data) => data.dosen_pa_id === dosenPAID)
        .filter((data) => data.mahasiswa.status_lulus === false);

      if (!dataChat) {
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }

      setDataChatPribadi(dataChat);
    } catch (error) {
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
      throw error;
    }
  };

  useEffect(() => {
    getDataPesanSiaran();
    getDataPesanChatSiaran();
  }, []);

  useEffect(() => {
    if (allPesanChatSiaran && allPesanSiaran && userDosenPA) {
      const selectedDataPesanSiaran = allPesanSiaran.find(
        (data) => data.dosen_pa_id === userDosenPA.id
      );
      const selectedDataPesanChatSiaran = allPesanChatSiaran.find(
        (data) => data.pesan_siaran_id === selectedDataPesanSiaran?.id
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
    if (dataUser && dataUser.email) {
      getDataDosenIDByEmail();
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
    userDosenPA,
    dataChatPribadi,
    dataPesanSiaran,
    selectedDataChatPribadi,
    selectedDataPesanSiaran,
    selectedDataPesanChatSiaran,
    sortedChatData,
    sortedPesanSiaranData,
    chatData,
    pesanChatSiaranData,
    chatMahasiswaData,
    chatDosenPAData,
    allPesanSiaran,
    allPesanChatSiaran,
  });

  return (
    <>
      {isLoading && <Spinner />}
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
                <div className="flex flex-col mt-4 md:mt-6">
                  <p className="mx-auto mb-2 md:mb-6 text-[12px] md:text-sm text-gray-500 font-medium">
                    Pesan Siaran
                  </p>
                  <div
                    className={`flex px-4 md:px-[32px] rounded-xl mx-4 md:mx-8 py-4 border justify-between items-center cursor-pointer`}
                    onClick={() => handleClickDetailPesanSiaran()}
                  >
                    <div className="flex gap-4">
                      <div className="min-w-[40px] rounded-full size-10 justify-center items-center bg-orange-200">
                        <Image
                          src={broadcastIcon}
                          className="size-10"
                          alt="broadcast"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className={`text-[12px] md:text-[16px] font-medium`}>
                          Pesan Siaran Mahasiswa Bimbingan
                        </p>

                        {selectedDataPesanSiaran.id ? (
                          <p className="text-[12px] md:text-[16px] max-w-[160px] md:max-w-[400px] lg:max-w-[700px] xl:max-w-[900px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                            Anda: {selectedDataPesanSiaran.pesan_terakhir}
                          </p>
                        ) : (
                          <p>
                            Anda belum memiliki pesan siaran satupun! silahkan
                            siarkan pesan.
                          </p>
                        )}
                      </div>
                    </div>

                    {selectedDataPesanSiaran.id && (
                      <div className="text-right h-full">
                        <p className="text-[12px] md:text-[14px]">
                          {(() => {
                            const date = new Date(
                              selectedDataPesanSiaran.waktu_pesan_terakhir
                            );
                            const formattedDate = date.toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            );

                            const formattedTime = date.toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                                timeZone: "Asia/Jakarta",
                              }
                            );

                            return `${formattedDate} ${formattedTime}`;
                          })()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {dataChatPribadi.length > 0 ? (
                  <div className="flex flex-col mt-4 md:mt-6">
                    <p className="mx-auto mb-4 md:mb-6 text-[12px] md:text-sm text-gray-500 font-medium">
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
                          <BubbleChatStart
                            key={index + "message"}
                            data={data}
                          />
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
    </>
  );
}
