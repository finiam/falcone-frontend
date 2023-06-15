// "use client";

import { ReactNode, useState } from "react";
import AssessmentButton from "./Button";
import AssessmentOptions from "./AssessmentOptions";

export enum AnswerOptions {
  In = "In-the-money",
  Out = "Out-of-the-money",
}

export type Answer = { option: AnswerOptions; description: string };

export type AnswerStatus = "unanswered" | "correct" | "incorrect";

export default function AssessmentLayout({
  answer,
  children,
  question,
}: {
  answer: Answer;
  children: ReactNode;
  question: string;
}) {
  // read status from local state
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("unanswered");

  const selectAnswer = (value: AnswerOptions) => {
    if (value === answer.option) {
      // update local state
      setAnswerStatus("correct");
      return;
    }
    setAnswerStatus("incorrect");
  };

  return (
    <>
      <h2 className="mb-3">Quick Assessment</h2>
      <p>{children}</p>
      <h2 className="mb-3">Question</h2>
      <p className="text-32">{question}</p>
      <AssessmentOptions selectAnswer={selectAnswer} />
    </>
  );
}
