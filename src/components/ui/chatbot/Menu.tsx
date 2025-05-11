import React from "react";

export default function Menu({ icon: Icon, content }: any) {
  return (
    <button className="flex flex-col gap-2 w-full text-4 p-4 cursor-pointer bg-white hover:bg-[#FE6500] rounded-lg border hover:text-white">
      {Icon && <Icon />} {/* Render icon jika ada */}
      <p className="text-[12px] md:text-[16px] md:text-[16px] md:text-4 text-left">
        {content}
      </p>
    </button>
  );
}
