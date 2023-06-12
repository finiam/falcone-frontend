"use client";

import { useAccount } from "@starknet-react/core";
import PositionsTable from "@/components/PositionsTable";

export default function PositionsPage() {
  const { isConnected } = useAccount();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full">
        <h2 className="text-xl font-bold">Positions</h2>

        {isConnected ? (
          <PositionsTable />
        ) : (
          <p>Connect your wallet to see positions</p>
        )}
      </div>
    </main>
  );
}
