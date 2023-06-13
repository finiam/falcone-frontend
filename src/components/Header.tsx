"use client";

import Link from "next/link";
import Wallet from "./Wallet";

export default function Header() {
  return (
    <header className="flex px-24 py-4 gap-8">
      <Link href="/trader" className="font-bold underline">
        Carmine
      </Link>

      <nav>
        <Link href="/trader/positions" className="font-bold">
          Positions
        </Link>
      </nav>

      <div className="ml-auto">
        <Wallet />
      </div>
    </header>
  );
}
