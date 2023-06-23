"use client";

import { useState } from "react";
import PageAssessment from "../DynamicAssessment/PageAssessment";
import { parseLiveOptions } from "@/lib/option";
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

  //TODO: filter data
  const data = parseLiveOptions(rawData);

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
