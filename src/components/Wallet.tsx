"use client";

import { truncateAddress } from "@/lib/truncateAddress";
import { useAccount, useConnectors } from "@starknet-react/core";
import DropdownMenu from "./DropdownMenu";

export default function Wallet() {
  const { isConnected, address } = useAccount();
  const { connectors, connect, disconnect } = useConnectors();

  if (isConnected) {
    return (
      <DropdownMenu
        dropdownContent={
          <button
            type="button"
            onClick={disconnect}
            className="border-none rounded-none shadow-transparent w-full bg-white text-16"
          >
            Disconnect
          </button>
        }
      >
        {truncateAddress(address)}
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu
      dropdownContent={
        <div>
          {connectors.map((connector) => (
            <button
              className="border-none rounded-none shadow-transparent w-full bg-white text-16"
              type="button"
              key={connector.id()}
              onClick={() => {
                connect(connector);
                connector.disconnect;
              }}
            >
              {connector.id()}
            </button>
          ))}
        </div>
      }
    >
      Connect
    </DropdownMenu>
  );
}
