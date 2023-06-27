"use client";

import { useState } from "react";
import PageAssessment from "../DynamicAssessment/PageAssessment";
import { filterOptions, parseLiveOptions } from "@/lib/option";
import OptionsList from "@/components/OptionsList";
import { OptionArg } from "@/types/option";
import SlippageInput from "@/components/SlippageInput";

export default function PageOptions({
  option,
  rawData,
}: {
  option: OptionArg;
  rawData: any;
}) {
  // TODO: get status from local storage
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  const data = filterOptions(parseLiveOptions(rawData), option);

  const markAssessmentAsComplete = () => {
    // TODO: update local storage
  };

  const displayOptions = () => setAssessmentComplete(true);

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
        <OptionsList data={data} />
      </div>
    </div>
  );
}
