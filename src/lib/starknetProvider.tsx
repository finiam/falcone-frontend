"use client";

import { StarknetConfig, InjectedConnector } from "@starknet-react/core";
import { ReactNode } from "react";

const connectors = [
  new InjectedConnector({ options: { id: "braavos" } }),
  new InjectedConnector({ options: { id: "argentX" } }),
];

export const StarknetProvider = ({ children }: { children: ReactNode }) => {
  return <StarknetConfig connectors={connectors}>{children}</StarknetConfig>;
};
