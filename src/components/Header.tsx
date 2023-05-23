"use client";

import Link from "next/link";
import Wallet from "./Wallet";

export default function Header() {
  return (
    <header className="flex justify-between">
      <Link href="/">Carmine</Link>
      <Wallet />
    </header>
  );
}
