"use client";

import Link from "next/link";
import Wallet from "./Wallet";

export default function Header() {
  return (
    <header className="flex gap-4 items-center justify-end relative z-1 pt-10 px-10">
      <nav className="flex gap-4 items-center">
        <Link href="/" className="hover:text-gray-700 drop-shadow-xl">
          Home
        </Link>
        <Link href="/dashboard" className="hover:text-gray-700 drop-shadow-xl">
          Dashboard
        </Link>
      </nav>
      <div className="w-36">
        <Wallet />
      </div>
    </header>
  );
}
