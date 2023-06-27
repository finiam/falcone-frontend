"use client";

import { useSlippage } from "@/lib/stores/useSlippage";
import { ChangeEvent } from "react";

export default function SlippageInput() {
  const { slippage, setSlippage } = useSlippage();

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (Number(ev.target.value) >= 0 && Number(ev.target.value) <= 25)
      setSlippage(Number(ev.target.value));
  };

  return (
    <div className="flex items-center w-fit gap-2">
      <span>Slippage</span>
      <input
        value={slippage || ""}
        onChange={handleChange}
        className="px-1 w-12 border border-light-blue rounded-sm outline-light-gray"
        min={1}
        max={25}
        required
      />
      <span>%</span>
    </div>
  );
}
