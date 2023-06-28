"use client";

import { useAccount } from "@starknet-react/core";
import PositionsTable from "@/components/PositionsTable";
import Header from "@/components/Header";

export default function PositionsPage() {
  const { isConnected } = useAccount();

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between pt-2 pb-12 px-24">
        <div className="w-full">
          <h1 className="text-32 font-500 mb-10">Dashboard</h1>
          {isConnected ? (
            <PositionsTable />
          ) : (
            <p className="text-20">Connect your wallet to see positions</p>
          )}
        </div>
      </main>
    </>
  );
}
