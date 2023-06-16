"use client";

import { useState } from "react";
import assessmentData, { AnswerOptions } from "@/data/assessments";
import Assessment from "./Assessment";

export type Answer = { option?: AnswerOptions; description: string };

export default function AssessmentLayout({
  type,
}: {
  type: "buying" | "selling";
}) {
  const assessments =
    type === "buying" ? assessmentData.buying : assessmentData.selling;
  const [currentAssessmentId, setCurrentAssessmentId] = useState<number>(0);

  const setCorrect = (id: string) => {
    // TODO:  update localStorage
  };

  const goToNextAssessment = () => {
    setCurrentAssessmentId((prevId) => (prevId + 1) % assessments.length);
  };

  return (
    <Assessment
      assessment={assessments[currentAssessmentId]}
      setCorrect={setCorrect}
      goToNext={goToNextAssessment}
    />
  );
}
