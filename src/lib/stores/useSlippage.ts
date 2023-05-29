import { create } from "zustand";

type UseSlippage = {
  slippage: number;
  setSlippage: (value: number) => void;
};

export const useSlippage = create<UseSlippage>((set) => ({
  slippage: 1,
  setSlippage: (value: number) => {
    set({ slippage: value });
  },
}));
