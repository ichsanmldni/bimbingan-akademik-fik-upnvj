import React from 'react'
import { UserRound } from "lucide-react";

export default function Header() {
  return (
    <div className='flex gap-4 px-[180px] py-2 bg-white shadow-md justify-start items-center'>
        <div className='p-1 rounded-full bg-orange-200'><UserRound className="" /></div>
        <p className='text-[18px]'>Nama Mahasiswa/Dosen</p>
    </div>
  )
}
