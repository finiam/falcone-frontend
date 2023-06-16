"use client";

import { useEffect, useState } from "react";
import InTheMoneyLabel from "@/components/InTheMoneyLabel";
import OutOfTheMoneyLabel from "@/components/OutOfTheMoneyLabel";
import { AnswerOptions, AssessmentType } from "@/data/assessments";
import { useEthToUsd } from "@/lib/hooks/useEthToUsd";
import AssessmentContext from "./AssessmentContext";
import AssessmentFeedback from "./AssessmentFeedback";
import AssessmentButton from "./Button";

export type AnswerStatus = "unanswered" | "correct" | "incorrect";

export default function Assessment({
  assessment,
  setCorrect,
  goToNext,
}: {
  assessment: AssessmentType;
  setCorrect: (id: string) => void;
  goToNext: () => void;
}) {
  // TODO: read status from local state
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("unanswered");
  const ethInUsd = useEthToUsd();

  useEffect(() => {
    setAnswerStatus("unanswered");
  }, [assessment.id]);

  const selectAnswer = (value: AnswerOptions) => {
    if (value === assessment.position) {
      setAnswerStatus("correct");
      setCorrect(assessment.id);
      return;
    }
    setAnswerStatus("incorrect");
  };

  return (
    <>
      <h2 className="mb-3">Quick Assessment</h2>
      <AssessmentContext assessment={assessment} />
      <h2 className="mb-3">Question</h2>
      <p className="text-32">
        {`At the expiration date, Ethereum is valued at $${
          Math.floor(ethInUsd) + assessment.closingPriceOffset
        }.`}
        <br /> How is your position?
      </p>
      {answerStatus === "unanswered" ? (
        <div className="flex gap-5 items-center">
          <AssessmentButton
            handleClick={() => selectAnswer(AnswerOptions.In)}
            type={AnswerOptions.In}
          >
            <InTheMoneyLabel />
          </AssessmentButton>
          <span className="text-32 uppercase">or</span>
          <AssessmentButton
            handleClick={() => selectAnswer(AnswerOptions.Out)}
            type={AnswerOptions.Out}
          >
            <OutOfTheMoneyLabel />
          </AssessmentButton>
        </div>
      ) : (
        <>
          <AssessmentFeedback
            position={assessment.position}
            answerStatus={answerStatus}
            feedback={assessment.answerDescription}
          />
          {answerStatus === "correct" ? (
            <button
              onClick={() => console.log("options")}
              className="mt-12 py-3 px-2 border border-light-gray rounded-sm"
            >
              see available options
            </button>
          ) : (
            <button
              onClick={goToNext}
              className="mt-12 py-3 px-2 border border-light-gray rounded-sm"
            >
              try again
            </button>
          )}
        </>
      )}
    </>
  );
}
