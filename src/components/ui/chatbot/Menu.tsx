import React from "react";

export default function Menu({ icon: Icon, content }: any) {
  return (
    <button className="duration-300 flex flex-col gap-2 w-full text-4 p-4 cursor-pointer bg-white hover:bg-orange-400 rounded-lg border">
      {Icon && <Icon />} {/* Render icon jika ada */}
      <p className="text-[12px] md:text-[16px] md:text-[16px] md:text-4 text-left">
        {content}
      </p>
    </button>
  );
}
