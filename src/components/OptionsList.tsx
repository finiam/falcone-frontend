"use client";

import { getSideName, getTypeName } from "@/lib/units";
import { useEffect, useState } from "react";
import OptionDetails from "./OptionDetails";
import { LiveOption } from "@/types/option";
import SlippageInput from "./SlippageInput";
import { parseLiveOptions } from "@/lib/option";

export default function OptionsList({ data }: { data: string[] }) {
  const [options, setOptions] = useState<LiveOption[]>();
  const [selectedOption, setSelectedOption] = useState<{
    index: number;
    data: LiveOption;
  } | null>();

  // useMemo causes hydration errors
  useEffect(() => {
    if (data) setOptions(parseLiveOptions(data));
  }, [data]);

  return (
    <div className="w-full">
      {selectedOption && (
        <OptionDetails
          option={selectedOption.data}
          index={selectedOption.index}
        />
      )}
      <div className="flex justify-end">
        <SlippageInput />
      </div>

      <h2 className="text-xl font-bold">Options</h2>

      <section className="flex flex-col gap-2 w-full">
        <div className="flex gap-8">
          <p className="w-1/4 font-bold">Type</p>
          <p className="w-1/4 font-bold">Strike price</p>
          <p className="w-1/4 font-bold">Maturity</p>
          <p className="w-1/4 font-bold">Premium</p>
        </div>
        {options ? (
          options.length > 0 ? (
            options.map((option, idx) => (
              <div
                key={option.id}
                onClick={() => setSelectedOption({ index: idx, data: option })}
                className="flex gap-8 cursor-pointer"
              >
                <div className="w-1/4">
                  {getTypeName(option.optionType)} /{" "}
                  {getSideName(option.optionSide)}
                </div>
                <div className="w-1/4">{option.strikePrice}</div>
                <div className="w-1/4">
                  {new Date(option.maturity).toLocaleDateString()}
                </div>
                <div className="w-1/4">{option.premiumDecimal.toFixed(4)}</div>
              </div>
            ))
          ) : (
            <p>No options available</p>
          )
        ) : (
          <p>fetching...</p>
        )}
      </section>
    </div>
  );
}
