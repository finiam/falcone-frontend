"use client";

import { ReactNode, useState } from "react";
import AssessmentButton from "./Button";
import Assessment from "./Assessment";
import AssessmentFeedback from "./AssessmentFeedback";
import assessmentData, {
  AnswerOptions,
  AssessmentType,
} from "@/data/assessments";

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
