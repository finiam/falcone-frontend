"use client";

import PageAssessment from "../DynamicAssessment/PageAssessment";
import { filterOptions, parseLiveOptions } from "@/lib/option";
import OptionsList from "@/components/OptionsList";
import { LiveOption, OptionArg } from "@/types/option";
import SlippageInput from "@/components/SlippageInput";
import { useEffect, useState } from "react";

export default function PageOptions({ option }: { option: OptionArg }) {
  const [data, setData] = useState<LiveOption[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);

    fetch("/api")
      .then((res) => res.json())
      .then(({ data: { data } }) => {
        data.length && setData(filterOptions(parseLiveOptions(data), option));
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  return (
    <PageAssessment optionType={option} filteredOptions={data}>
      <div className="w-full ">
        <div className="flex justify-between mt-16 mb-8">
          <h2>Available options</h2>
          <div className="mr-16">
            <SlippageInput />
          </div>
        </div>
        <div>
          <OptionsList options={data} fetching={fetching} />
        </div>
      </div>
    </PageAssessment>
  );
}
