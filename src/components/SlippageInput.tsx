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
    <div className="w-fit">
      <p>Slippage (%)</p>
      <input
        value={slippage || ""}
        onChange={handleChange}
        className="bg-slate-800 py-1 px-2 w-24"
        min={1}
        max={25}
        required
      />
    </div>
  );
}
