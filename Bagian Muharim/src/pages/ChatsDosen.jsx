import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { MessageSquareText } from 'lucide-react';
import MessageMahasiswa from '../components/MessageMahasiswa';

export default function ChatsDosen() {
    const data = [
    {
      bulan: "Januari",
      topikChatbot: ["Penjadwalan", "Konsultasi Akademik"],
    },
    {
      bulan: "Februari",
      topikChatbot: ["Informasi Matakuliah", "Konsultasi Skripsi"],
    },
    {
      bulan: "Maret",
      topikChatbot: ["Pengumpulan Tugas", "Penjadwalan"],
    },
    {
      bulan: "Januari",
      topikChatbot: ["Penjadwalan", "Konsultasi Akademik"],
    },
    {
      bulan: "Februari",
      topikChatbot: ["Informasi Matakuliah", "Konsultasi Skripsi"],
    },
    {
      bulan: "Januari",
      topikChatbot: ["Penjadwalan", "Konsultasi Akademik"],
    },
    {
      bulan: "Februari",
      topikChatbot: ["Informasi Matakuliah", "Konsultasi Skripsi"],
    },
  ];
  return (
    <>
      <div>    
        <Navbar />
        <div className='flex'>
          <Sidebar data={data}/>
          <div className='flex flex-col gap-4 pb-[112px] pt-[88px] w-full h-[100vh] justify-start'>
            <div className='flex gap-4 px-[180px] py-2 bg-white shadow-md justify-start items-center'>
                <div className='p-1 rounded-full bg-orange-200'><MessageSquareText /></div>
                <p className='text-[18px]'>Pesan</p>
            </div>
            <div className='px-[120px] flex flex-col gap-4 overflow-y-auto h-[200%]'>
               <MessageMahasiswa namaMahasiswa="John Doe" time="10:30 AM" isRead={false} />
               <MessageMahasiswa namaMahasiswa="John Doe" time="10:30 AM" isRead={false} />
               <MessageMahasiswa namaMahasiswa="John Doe" time="10:30 AM" isRead={false} />
               <MessageMahasiswa namaMahasiswa="John Doe" time="10:30 AM" isRead={false} />
               <MessageMahasiswa namaMahasiswa="John Doe" time="10:30 AM" isRead={false} />
               <MessageMahasiswa namaMahasiswa="John Doe" time="10:30 AM" isRead={false} />
               <MessageMahasiswa namaMahasiswa="John Doe" time="10:30 AM" isRead={false} />
               <MessageMahasiswa namaMahasiswa="John Doe" time="10:30 AM" isRead={false} />
               <MessageMahasiswa namaMahasiswa="John Doe" time="10:30 AM" isRead={false} />
               <MessageMahasiswa namaMahasiswa="John Doe" time="10:30 AM" isRead={false} />
               <MessageMahasiswa namaMahasiswa="John Doe" time="10:30 AM" isRead={false} />
               <MessageMahasiswa namaMahasiswa="John Doe" time="10:30 AM" isRead={false} />

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
