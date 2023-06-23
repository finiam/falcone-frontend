"use client";

import { useState } from "react";
import PageAssessment from "../DynamicAssessment/PageAssessment";
import { filterOptions, parseLiveOptions } from "@/lib/option";
import OptionsList from "@/components/OptionsList";
import { OptionArg } from "@/types/option";

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
    <>
      <h2>Available options</h2>
      <div>
        <OptionsList data={data} />
      </div>
    </>
  );
}
