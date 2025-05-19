"use client";

import HeaderChatbot from "@/components/ui/chatbot/ChatDosenHeader";
import NavbarChatbot from "@/components/ui/chatbot/NavbarChatbot";
import TextInputPesanMahasiswa from "@/components/ui/TextInputPesanMahasiswa";
import backIcon from "../../../assets/images/back-icon-black.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import broadcastIcon from "../../../assets/images/broadcast-icon.png";
import chatIcon from "../../../assets/images/userpa-icon.png";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import BubbleChatStart from "@/components/ui/BubbleChatStart";
import BubbleChatEnd from "@/components/ui/BubbleChatEnd";
import { env } from "process";
import { MessageSquareText } from "lucide-react";
import { select } from "slate";
import ProfileImage from "@/components/ui/ProfileImage";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export const selectIsLoadingGlobal = ({
  dataUser,
  userDosenPA,
  dataPesanSiaran,
  dataPesanChatSiaran,
  chatData,
  chatMahasiswaData,
  chatDosenPAData,
  sortedChatData,
  sortedPesanChatSiaran,
  allPesanChatMahasiswa,
}: {
  dataUser: any | null; // null: masih loading, object: selesai
  userDosenPA: any | null;
  dataPesanSiaran: any[] | null; // null: loading, []: selesai tapi kosong
  dataPesanChatSiaran: any[] | null;
  chatData: any[] | null;
  chatMahasiswaData: any[] | null;
  chatDosenPAData: any[] | null;
  sortedChatData: any[] | null;
  sortedPesanChatSiaran: any[] | null;
  allPesanChatMahasiswa: any[] | null;
}) => {
  const checks = {
    dataUser: dataUser !== null,
    userDosenPA: userDosenPA !== null,
    dataPesanSiaran: dataPesanSiaran !== null,
    dataPesanChatSiaran: dataPesanChatSiaran !== null,
    chatData: chatData !== null,
    chatMahasiswaData: chatMahasiswaData !== null,
    chatDosenPAData: chatDosenPAData !== null,
    sortedChatData: sortedChatData !== null,
    sortedPesanChatSiaran: sortedPesanChatSiaran !== null,
    allPesanChatMahasiswa: allPesanChatMahasiswa !== null,
  };

  console.log("Cek data loading:", checks);

  return Object.values(checks).some((value) => value === false);
};

export function Spinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[1000]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-b-transparent"></div>
    </div>
  );
}

export default function ChatDosenPA() {
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

  const [userDosenPA, setUserDosenPA] = useState<any>(null);
  const [isMahasiswaChatting, setIsMahasiswaChatting] = useState<any>(false);
  const [selectedDataChatPribadi, setSelectedDataChatPribadi] = useState<any>(
    {}
  );
  const [selectedDataPesanSiaran, setSelectedDataPesanSiaran] = useState<any>(
    []
  );
  const [dataPesanSiaran, setDataPesanSiaran] = useState([]);
  const [chatData, setChatData] = useState<any>([]);
  const [dataPesanChatSiaran, setDataPesanChatSiaran] = useState<any>([]);
  const [chatMahasiswaData, setChatMahasiswaData] = useState<any>([]);
  const [chatDosenPAData, setChatDosenPAData] = useState<any>([]);
  const [sortedChatData, setSortedChatData] = useState<any>([]);
  const [sortedPesanChatSiaran, setSortedPesanChatSiaran] = useState<any>([]);
  const [mahasiswaID, setMahasiswaID] = useState();
  const [isDetailChatPribadiClicked, setIsDetailChatPribadiClicked] =
    useState(false);
  const [isDetailPesanSiaranClicked, setIsDetailPesanSiaranClicked] =
    useState(false);

  const [statusPembacaanPesanSiaran, setStatusPembacaanPesanSiaran] =
    useState<any>({});

  const [allPesanChatMahasiswa, setAllPesanChatMahasiswa] = useState([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const addChatMahasiswa = async (newChat: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chatmahasiswa`,
        newChat
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getStatusPembacaanPesanSiaran = async () => {
    const dataStatusPembacaan = await axios.get(
      `${API_BASE_URL}/api/statuspembacaanpesansiaran`
    );

    const dataStatus = dataStatusPembacaan.data.find(
      (data) => data.mahasiswa.nim === dataUser.nim
    );

    setStatusPembacaanPesanSiaran(dataStatus);
  };

  const getDataMahasiswaIDByNIM = async () => {
    const dataMahasiswa = await axios.get(`${API_BASE_URL}/api/datamahasiswa`);

    const mahasiswa = dataMahasiswa.data.find(
      (data) => data.nim === dataUser.nim
    );
    setMahasiswaID(mahasiswa.id);
  };

  const handleAddChatMahasiswa = async (newData: any) => {
    const newChat = {
      ...newData,
      chat_pribadi_id: selectedDataChatPribadi.id || undefined,
      mahasiswa_id: mahasiswaID,
      dosen_pa_id: userDosenPA?.id,
    };

    try {
      await addChatMahasiswa(newChat);
      getDataChatPribadiByMahasiswaId();
    } catch (error) {}
  };

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const getDataDosenPaByMahasiswaID = async () => {
    try {
      const dataDosenPa = await axios.get(`${API_BASE_URL}/api/datadosenpa`);

      const dataMahasiswa = await axios.get(
        `${API_BASE_URL}/api/datamahasiswa`
      );

      const dataUserMahasiswa = dataMahasiswa.data.find(
        (data) => data.id === mahasiswaID
      );
      const dosenPa = dataDosenPa.data.find(
        (data) => data.id === dataUserMahasiswa.dosen_pa_id
      );

      if (!dosenPa) {
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }
      setUserDosenPA(dosenPa);
    } catch (error) {
      throw error;
    }
  };

  const getDataChatPribadiByMahasiswaId = async () => {
    try {
      const dataChatPribadi = await axios.get(
        `${API_BASE_URL}/api/chatpribadi`
      );

      const dataChat = dataChatPribadi.data.find(
        (data) => data.mahasiswa_id === mahasiswaID
      );

      if (!dataChat) {
        setIsMahasiswaChatting(false);
        setSelectedDataChatPribadi({});
        return;
      }
      setIsMahasiswaChatting(true);
      setSelectedDataChatPribadi(dataChat);
    } catch (error) {
      throw error;
    }
  };
  const getDataPesanSiaranByMahasiswaId = async () => {
    try {
      const dataPesanSiaran = await axios.get(
        `${API_BASE_URL}/api/pesansiaran`
      );
      const dataMahasiswa = await axios.get(
        `${API_BASE_URL}/api/datamahasiswa`
      );

      const mahasiswa = dataMahasiswa.data
        .filter((data) => data.status_lulus === false)
        .find((data) => data.id === mahasiswaID);

      const dataSiaran = dataPesanSiaran.data.filter(
        (data) => data.dosen_pa_id === mahasiswa.dosen_pa_id
      );

      if (!dataSiaran) {
        return;
      }
      setDataPesanSiaran(dataSiaran);
    } catch (error) {
      throw error;
    }
  };

  const getDataChatDosenPAByChatPribadiId = async () => {
    try {
      const dataChatDosenPA = await axios.get(
        `${API_BASE_URL}/api/chatdosenpa`
      );

      const dataChat = dataChatDosenPA.data.filter(
        (data) => data.chat_pribadi_id === selectedDataChatPribadi.id
      );

      if (!dataChat) {
        setIsMahasiswaChatting(false);
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }
      setChatDosenPAData(dataChat);
    } catch (error) {
      throw error;
    }
  };

  const getDataChatMahasiswa = async () => {
    try {
      const dataChatMahasiswa = await axios.get(
        `${API_BASE_URL}/api/chatmahasiswa`
      );
      setAllPesanChatMahasiswa(dataChatMahasiswa.data);
    } catch (error) {
      throw error;
    }
  };

  const getDataChatMahasiswaByChatPribadiId = async () => {
    try {
      const dataChatMahasiswa = await axios.get<any>(
        `${API_BASE_URL}/api/chatmahasiswa`
      );
      const dataChat = dataChatMahasiswa.data.filter(
        (data) => data.chat_pribadi_id === selectedDataChatPribadi.id
      );

      if (!dataChat) {
        setIsMahasiswaChatting(false);
        return; // Hentikan eksekusi jika dosen PA tidak ditemukan
      }
      setChatMahasiswaData(dataChat);
      setIsMahasiswaChatting(true);
    } catch (error) {
      throw error;
    }
  };

  const getDataPesanChatSiaranByPesanSiaranId = async () => {
    try {
      const dataPesanChatSiaran = await axios.get(
        `${API_BASE_URL}/api/pesanchatsiaran`
      );

      let dataChatSiaran;
      if (dataPesanSiaran && dataPesanSiaran.length > 0) {
        dataChatSiaran = dataPesanChatSiaran.data.filter(
          (data) => data.pesan_siaran_id === dataPesanSiaran[0]?.id
        );
      }

      if (!dataChatSiaran) {
        return;
      }
      setDataPesanChatSiaran(dataChatSiaran);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getDataChatMahasiswa();
  }, []);

  useEffect(() => {
    if (dataUser && dataUser.nim) {
      getDataMahasiswaIDByNIM();
      getStatusPembacaanPesanSiaran();
    }
  }, [dataUser]);

  useEffect(() => {
    if (mahasiswaID) {
      getDataDosenPaByMahasiswaID();
      getDataChatPribadiByMahasiswaId();
      getDataPesanSiaranByMahasiswaId();
    }
  }, [mahasiswaID]);

  useEffect(() => {
    getDataChatMahasiswaByChatPribadiId();
    getDataChatDosenPAByChatPribadiId();
  }, [isMahasiswaChatting, selectedDataChatPribadi]);

  useEffect(() => {
    if (dataPesanSiaran) {
      getDataPesanChatSiaranByPesanSiaranId();
    }
  }, [dataPesanSiaran]);

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
    const sortedPesanChatSiaran = [...dataPesanChatSiaran].sort(
      (a, b) =>
        new Date(a.waktu_kirim).getTime() - new Date(b.waktu_kirim).getTime()
    );

    setSortedPesanChatSiaran(sortedPesanChatSiaran);
  }, [dataPesanChatSiaran]);

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

  const handleClickDetailChatPribadi = (data: any) => {
    setSelectedDataChatPribadi(data);
    setIsDetailChatPribadiClicked(true);
    if (!data.is_mahasiswa_pesan_terakhir_read) {
      handleEditChatPribadi(data);
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sortedChatData, handleClickDetailChatPribadi]);

  const handleClickDetailPesanSiaran = (data: any, statusPembacaan) => {
    setSelectedDataPesanSiaran(data);
    setIsDetailPesanSiaranClicked(true);
    if (statusPembacaan && !statusPembacaan?.is_read) {
      handleEditStatusPembacaan(statusPembacaan);
    }
  };

  const handleEditStatusPembacaan = async (data: any) => {
    const updatedData = {
      mahasiswa_id: data?.mahasiswa_id,
    };

    try {
      const result = await patchStatusPembacaanPesanSiaran(updatedData);
    } catch (error) {}
  };

  const patchStatusPembacaanPesanSiaran = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/statuspembacaanpesansiaran`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sortedPesanChatSiaran, handleClickDetailPesanSiaran]);

  const handleEditChatPribadi = async (data: any) => {
    const updatedData = {
      id: data.id,
    };

    try {
      const result = await patchChatPribadi(updatedData);
    } catch (error) {}
  };

  const patchChatPribadi = async (updatedData: any) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/chatpribadi/updateisreadmahasiswa`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getStatusPembacaanPesanSiaran();
  }, [isDetailPesanSiaranClicked]);

  const date = new Date(selectedDataChatPribadi.waktu_pesan_terakhir);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Format waktu dalam UTC+7
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Format AM/PM
    timeZone: "Asia/Jakarta", // Menggunakan zona waktu UTC+7
  });

  // Gabungkan tanggal dan waktu
  const formattedDateTime = `${formattedDate} ${formattedTime}`;

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
    dataUser,
    userDosenPA,
    dataPesanSiaran,
    dataPesanChatSiaran,
    chatData,
    chatMahasiswaData,
    chatDosenPAData,
    sortedChatData,
    sortedPesanChatSiaran,
    allPesanChatMahasiswa,
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
              {userData.status_lulus === false && (
                <div className="flex flex-col mb-4 overflow-y-auto h-[200%]">
                  {dataPesanSiaran?.map((data, index) => {
                    return (
                      <div key={index} className="flex flex-col mt-4 md:mt-6">
                        <p className="mx-auto mb-2 md:mb-6 text-[12px] md:text-sm text-gray-500 font-medium">
                          Pesan Siaran
                        </p>
                        <div
                          onClick={() =>
                            handleClickDetailPesanSiaran(
                              data,
                              statusPembacaanPesanSiaran
                            )
                          }
                          className={`flex gap-2 md:gap-0 px-4 md:pl-[32px] md:pr-2 rounded-xl mx-4 md:mx-8 py-4 border justify-between cursor-pointer`}
                        >
                          <div className="flex gap-4">
                            <div className="min-w-[40px] rounded-full size-10 justify-center items-center bg-orange-200">
                              <Image
                                src={broadcastIcon}
                                className="size-10"
                                alt="broadcast"
                              />
                            </div>
                            <div className="flex flex-col gap-2 max-w-[160px] md:max-w-[900px] ">
                              <p
                                className={`text-[12px] md:text-[16px] font-medium`}
                              >
                                Pesan Siaran Mahasiswa Bimbingan{" "}
                                <span>{data.dosen_pa.nama.split(",")[0]}</span>
                              </p>
                              <div className="md:max-h-[40px] max-w-[160px] md:max-w-[400px] lg:max-w-[700px] xl:max-w-[900px] overflow-hidden">
                                <p className="text-[12px] md:text-[16px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                                  <span>
                                    {data.dosen_pa.nama.split(",")[0]}:{" "}
                                  </span>
                                  {data.pesan_terakhir}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`${statusPembacaanPesanSiaran && statusPembacaanPesanSiaran?.is_read ? "pb-8" : "flex flex-col gap-2"}`}
                          >
                            <p
                              className={`${statusPembacaanPesanSiaran && statusPembacaanPesanSiaran?.is_read ? "" : "font-semibold text-orange-500"} text-[12px] md:text-[14px] align-top md:min-w-[170px]`}
                            >
                              {(() => {
                                const date = new Date(
                                  data.waktu_pesan_terakhir
                                );
                                const formattedDate = date.toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                );

                                // Format waktu dalam UTC+7
                                const formattedTime = date.toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true, // Format AM/PM
                                    timeZone: "Asia/Jakarta", // Menggunakan zona waktu UTC+7
                                  }
                                );

                                // Gabungkan tanggal dan waktu
                                const formattedDateTime = `${formattedDate} ${formattedTime}`;
                                return formattedDateTime;
                              })()}
                            </p>

                            <p
                              className={`${statusPembacaanPesanSiaran?.is_read ? "hidden" : "font-semibold text-[12px] md:text-[16px]"}`}
                            >
                              Belum Dibaca!
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex flex-col mt-4 md:mt-6">
                    <p className="mx-auto mb-2 md:mb-6 text-[12px] md:text-sm text-gray-500 font-medium">
                      Pesan Pribadi
                    </p>
                    {selectedDataChatPribadi.id && (
                      <div
                        onClick={() =>
                          handleClickDetailChatPribadi(selectedDataChatPribadi)
                        }
                        className={`flex px-4 md:px-[32px] rounded-xl mx-4 md:mx-8 py-4 border justify-between items-center cursor-pointer`}
                      >
                        <div className="flex gap-4">
                          <div className="rounded-full size-10 md:size-12 bg-orange-200">
                            {selectedDataChatPribadi.dosen_pa?.profile_image ? (
                              <img
                                src={`../${selectedDataChatPribadi.dosen_pa.profile_image}`}
                                alt="Profile"
                                className="rounded-full size-10 md:size-12 cursor-pointer"
                              />
                            ) : (
                              <ProfileImage
                                onClick={() => {}}
                                className="size-10 md:size-12 cursor-pointer"
                              />
                            )}
                          </div>
                          <div className="flex flex-col gap-2 text-[12px] md:text-[16px]">
                            <p>{selectedDataChatPribadi.dosen_pa?.nama}</p>
                            <div className="md:max-h-[40px] max-w-[160px] md:max-w-[400px] lg:max-w-[700px] xl:max-w-[900px] overflow-hidden">
                              <p
                                className={`${selectedDataChatPribadi.is_mahasiswa_pesan_terakhir_read || selectedDataChatPribadi.pengirim_pesan_terakhir === "Mahasiswa" ? "whitespace-nowrap overflow-ellipsis overflow-hidden" : "font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden"}`}
                              >
                                {selectedDataChatPribadi.pengirim_pesan_terakhir ===
                                  "Mahasiswa" && <span>Anda: </span>}
                                {selectedDataChatPribadi.pesan_terakhir}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`${selectedDataChatPribadi.is_mahasiswa_pesan_terakhir_read || selectedDataChatPribadi.pengirim_pesan_terakhir === "Mahasiswa" ? "text-[12px] md:text-[16px] pb-6 md:pb-8" : "text-[12px] md:text-[16px] flex flex-col gap-2"}`}
                        >
                          <p
                            className={`${selectedDataChatPribadi.is_mahasiswa_pesan_terakhir_read || selectedDataChatPribadi.pengirim_pesan_terakhir === "Mahasiswa" ? "text-[12px] md:text-[14px]" : "text-[12px] md:text-[14px] font-semibold text-orange-500"}`}
                          >
                            {formattedDateTime}
                          </p>
                          <p
                            className={`${selectedDataChatPribadi.is_mahasiswa_pesan_terakhir_read || selectedDataChatPribadi.pengirim_pesan_terakhir === "Mahasiswa" ? "hidden" : " text-[12px] md:text-[16px] font-semibold"}`}
                          >
                            Belum Dibaca!
                          </p>
                        </div>
                      </div>
                    )}
                    {!selectedDataChatPribadi.id && (
                      <div
                        className={`flex px-4 md:px-[32px] rounded-xl mx-4 md:mx-8 py-4 border justify-between items-center cursor-pointer`}
                        onClick={() => setIsDetailChatPribadiClicked(true)}
                      >
                        <div className="flex gap-4">
                          <div className="flex items-center justify-center min-w-10 h-10 rounded-full bg-orange-200">
                            <Image
                              src={chatIcon}
                              alt="chat"
                              className="w-6 h-6"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <p
                              className={`text-[12px] md:text-[16px] font-medium`}
                            >
                              Pesan Pribadi dengan Dosen Pembimbing Akademik
                            </p>
                            <p className="text-[12px] md:text-[16px]">
                              Anda belum memiliki pesan kepada dosen pembimbing
                              akademik! silahkan ketuk untuk mulai percakapan
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {userData.status_lulus === true && (
                <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md px-4 py-3 mx-4 md:mx-8 mt-4 md:mt-8 mb-4 text-sm md:text-base">
                  Anda telah lulus dan tidak lagi terdaftar sebagai mahasiswa
                  bimbingan. Oleh karena itu, fitur{" "}
                  <strong>Pesan Siaran</strong> dan{" "}
                  <strong>Pesan Pribadi</strong> dengan dosen pembimbing tidak
                  tersedia.
                </div>
              )}
            </div>
          ) : isDetailChatPribadiClicked ? (
            <div className="flex flex-col h-screen w-full">
              <div className="pl-4 flex border items-center">
                <button
                  onClick={() => {
                    setIsDetailChatPribadiClicked(false);
                    getDataChatPribadiByMahasiswaId();
                  }}
                >
                  <Image alt="back-icon" src={backIcon} className="size-8" />
                </button>
                <HeaderChatbot data={userDosenPA} />
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
                        {data.role === "Dosen PA" ? (
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
                <TextInputPesanMahasiswa
                  handleAddChatMahasiswa={handleAddChatMahasiswa}
                />
              </div>
            </div>
          ) : isDetailPesanSiaranClicked ? (
            <div className="flex flex-col h-screen pb-[40px] w-full">
              <div className="pl-4 flex border items-center">
                <button
                  onClick={() => {
                    setIsDetailPesanSiaranClicked(false);
                    getDataPesanSiaranByMahasiswaId();
                  }}
                >
                  <Image alt="back-icon" src={backIcon} className="size-8" />
                </button>
                <HeaderChatbot data={userDosenPA} />
              </div>
              <div className="h-full overflow-y-scroll px-[40px] flex flex-col w-full justify-between gap-8">
                <div
                  id="message-container"
                  className="flex-1 w-full flex flex-col"
                >
                  {sortedPesanChatSiaran.map((data, index) => {
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

                        <BubbleChatStart key={index + "message"} data={data} />
                      </React.Fragment>
                    );
                  })}
                  <div ref={messageEndRef} />
                </div>
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
