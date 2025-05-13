"use client";
import React, { useEffect, useState } from "react";
import { Bell, MessageSquareText } from "lucide-react";
import Notification from "./NotificationChatbot";
import Image from "next/image";
import Logo from "@/components/ui/LogoUPNVJ";
import backIcon from "../../../assets/images/back-icon-black.png";
import Link from "next/link";
import LogoBimafik from "../LogoBimafik";
import notificationIcon from "../../../assets/images/bell.png";
import NotificationModal from "../NotificationModal";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchNotifikasi } from "@/lib/features/notificationSlice";
import { useSelector } from "react-redux";
import { fetchPesanPribadi } from "@/lib/features/pesanPribadiSlice";
import {
  fetchPesanSiaran,
  fetchStatusPesanSiaran,
} from "@/lib/features/pesanSiaranSlice";

export default function NavbarChatbot({
  isPathChatbot,
  dataUser,
  roleUser,
}: any) {
  const [isModalNotificationOpen, setIsModalNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isUnreadMessages, setIsUnreadMessages] = useState(false);
  const [isChatPribadiUnread, setIsChatPribadiUnread] = useState(false);
  const [isPesanSiaranUnread, setIsPesanSiaranUnread] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

  const dispatch = useDispatch<AppDispatch>();

  const dataNotifikasi = useSelector(
    (state: RootState) => state.notifikasi?.data
  );
  const dataPesanSiaran = useSelector(
    (state: RootState) => state.pesanSiaran?.data
  );
  const dataPesanPribadi = useSelector(
    (state: RootState) => state.pesanPribadi?.data
  );

  const isPesanSiaranDosenPAUnread = useSelector(
    (state: RootState) => state.pesanSiaran?.isPesanSiaranDosenPAUnread
  );
  const userId: number = dataUser?.id;

  const closeNotificationModal = () => {
    setIsModalNotificationOpen(false);
  };

  const getIsChatPribadiReadByUserId = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chatpribadi`);

      const dataChatPribadi = response.data;

      const chatPribadiUser = dataChatPribadi.find(
        (data) => data.mahasiswa_id === dataUser.id
      );

      const isMahasiswaRead = chatPribadiUser.is_mahasiswa_pesan_terakhir_read;

      setIsChatPribadiUnread(!isMahasiswaRead);
    } catch (error) {
      throw error;
    }
  };
  const getIsPesanSiaranReadByUserId = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/statuspembacaanpesansiaran`
      );

      const dataStatusPembacaanPesanSiaran = response.data;

      const pesanSiaranUser = dataPesanSiaran.find(
        (data) => data.dosen_pa_id === dataUser.dosen_pa_id
      );

      const dataStatusPembacaanPesanSiaranUser = dataStatusPembacaanPesanSiaran
        .filter((data) => data.pesan_siaran_id === pesanSiaranUser.id)
        .find((data) => data.mahasiswa_id === dataUser.id);

      const isPesanSiaranUserRead = dataStatusPembacaanPesanSiaranUser.is_read;

      setIsPesanSiaranUnread(!isPesanSiaranUserRead);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const count = dataNotifikasi?.filter((data) => data.read === false).length;
    setNotificationCount(count);
  }, [dataNotifikasi]);

  useEffect(() => {
    if (dataUser && dataUser.id && dataUser.dosen_pa_id) {
      getIsChatPribadiReadByUserId();
      getIsPesanSiaranReadByUserId();
    }
  }, [dataUser]);

  useEffect(() => {
    if (isPesanSiaranUnread || isChatPribadiUnread) {
      setIsUnreadMessages(true);
    }
  }, [isPesanSiaranUnread, isChatPribadiUnread]);

  useEffect(() => {
    if (roleUser && dataUser?.id) {
      dispatch(fetchNotifikasi({ roleUser, userId }));
    }
    if (["Mahasiswa", "Dosen PA"].includes(roleUser) && dataUser?.id) {
      dispatch(fetchPesanPribadi({ userId, roleUser }));
    }
    if (
      ["Mahasiswa"].includes(roleUser) &&
      dataUser?.id &&
      dataUser?.dosen_pa_id
    ) {
      dispatch(fetchPesanSiaran());
      dispatch(
        fetchStatusPesanSiaran({
          userId: dataUser.id,
          dosenPaId: dataUser.dosen_pa_id,
        })
      );
    }
  }, [dispatch, roleUser, dataUser?.id]);

  return (
    <div
      className="flex w-full h-[70px] items-center justify-between shadow-sm px-4 md:px-8 bg-white fixed top-0 left-0 z-50"
      style={{ zIndex: 50 }}
    >
      <div className="flex gap-2">
        <a
          href="/"
          className={`flex items-center ${!isPathChatbot ? "hidden" : ""}`}
        >
          <Image src={backIcon} alt="back-icon" />
        </a>
        <div className="flex items-center">
          <div className="min-w-[40px]">
            <LogoBimafik className="size-[40px]" />
          </div>
          <p className="font-semibold text-[14px] md:text-[20px] ml-4">
            Chatbot Bimbingan Akademik FIK
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/chatpribadi" className="relative">
          <MessageSquareText className="hover:text-[#FB923C] cursor-pointer" />
          {/* Titik merah untuk menandakan chat belum dibalas */}
          {isUnreadMessages && (
            <span className="absolute top-[-5px] right-[-5px] bg-red-600 rounded-full w-2.5 h-2.5" />
          )}
        </Link>
        <div
          className="relative inline-block cursor-pointer"
          onClick={() => setIsModalNotificationOpen((prev) => !prev)}
        >
          <Image
            src={notificationIcon}
            alt="Notification Icon"
            className="w-6 h-6 cursor-pointer"
            width={24}
            height={24}
          />
          {notificationCount > 0 && (
            <span className="absolute top-[-5px] right-[-5px] bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>
        {isModalNotificationOpen && (
          <NotificationModal
            dataNotifikasi={dataNotifikasi}
            className="fixed inset-0 flex items-start mt-[60px] mr-[50px] justify-end z-50"
            onClose={closeNotificationModal}
            onRead={() => dispatch(fetchNotifikasi({ roleUser, userId }))}
            dataUser={dataUser}
            roleUser={roleUser}
          />
        )}
      </div>
    </div>
  );
}
