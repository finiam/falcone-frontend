"use client";

import { ReactNode, useState } from "react";

export default function DropdownMenu({
  children,
  dropdownContent,
}: {
  children: ReactNode;
  dropdownContent: ReactNode;
}) {
  const [showContent, setShowContent] = useState(false);

  const handleMouseEnter = () => setShowContent(true);
  const handleMouseLeave = () => setShowContent(false);

  return (
    <div
      className="relative w-fit z-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cursor-pointer gap-2 px-3 py-2 rounded-md border shadow-sm bg-white border-light-gray flex items-center">
        <span>{children}</span>
        <span className="leading-1 h-6">&#8964;</span>
      </div>
      <div
        className={`flex flex-col  bg-white left-1 right-1 rounded-b-sm overflow-hidden absolute ${
          showContent ? "block" : "hidden"
        }`}
      >
        {dropdownContent}
      </div>
    </div>
  );
}
