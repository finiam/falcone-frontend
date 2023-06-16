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
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentType>(
    assessments?.[0] || []
  );

  console.log(assessmentData);
  console.log(assessments);

  const setCorrect = (id: string) => {
    // TODO: update localStorage
  };

  return <Assessment assessment={currentAssessment} setCorrect={setCorrect} />;
}
