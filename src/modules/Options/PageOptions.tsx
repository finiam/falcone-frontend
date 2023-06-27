"use client";

import { useEffect, useMemo, useState } from "react";
import PageAssessment from "../DynamicAssessment/PageAssessment";
import { filterOptions, parseLiveOptions } from "@/lib/option";
import OptionsList from "@/components/OptionsList";
import { LiveOption, OptionArg } from "@/types/option";
import SlippageInput from "@/components/SlippageInput";

export default function PageOptions({ option }: { option: OptionArg }) {
  // TODO: get status from local storage
  const [assessmentComplete, setAssessmentComplete] = useState(true);
  const [data, setData] = useState<LiveOption[]>([]);
  const [fetching, setFetching] = useState(false);

  const markAssessmentAsComplete = () => {
    // TODO: update local storage
  };

  const displayOptions = () => setAssessmentComplete(true);

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

  if (!assessmentComplete) {
    return (
      <PageAssessment
        option={option}
        displayOptions={displayOptions}
        completeAssessment={markAssessmentAsComplete}
      />
    );
  }

  return (
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
  );
}
