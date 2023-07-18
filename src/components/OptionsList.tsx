"use client";

import { getSideName, getTypeName } from "@/lib/units";
import { useState } from "react";
import OptionDetails from "./OptionDetails";
import { LiveOption } from "@/types/option";
import Loader from "./icons/Loader";

type OptionsListProps = {
  options: LiveOption[];
  fetching: boolean;
};

export default function OptionsList({ options, fetching }: OptionsListProps) {
  const [selectedOption, setSelectedOption] = useState<{
    index: number;
    data: LiveOption;
  } | null>();

  const hideDetails = () => setSelectedOption(null);

  return (
    <div className="w-full">
      <section className="flex flex-col gap-2 w-5/6 mx-auto">
        <div className="flex gap-8 font-600">
          <span className="w-1/4">Type</span>
          <span className="w-1/4">Strike price</span>
          <span className="w-1/4">Maturity</span>
          <span className="w-1/4">Premium</span>
        </div>
        {!fetching ? (
          options.length > 0 ? (
            options.map((option, idx) => (
              <div
                key={option.id}
                onClick={() => setSelectedOption({ index: idx, data: option })}
                className="flex flex-col py-4 gap-4 cursor-pointer border-b border-light-gray last-of-type:border-none"
              >
                <div className="flex gap-8">
                  <div className="w-1/4 capitalize">
                    {getSideName(option.optionSide)}{" "}
                    {getTypeName(option.optionType)}
                  </div>
                  <div className="w-1/4">${option.strikePrice}</div>
                  <div className="w-1/4">
                    {new Date(option.maturity).toLocaleDateString("en-UK", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </div>
                  <div className="w-1/4">
                    {option.premiumDecimal.toFixed(4)}
                  </div>
                </div>
                {idx === selectedOption?.index && (
                  <OptionDetails
                    hideDetails={hideDetails}
                    option={selectedOption.data}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="my-5">No options available</p>
          )
        ) : (
          <div className="my-5 flex gap-4 items-center">
            <Loader />
            <p className="text-sm m-0">fetching...</p>
          </div>
        )}
      </section>
    </div>
  );
}
