"use client";

import { useEffect, useMemo, useState } from "react";
import {
  UserInputQuestion,
  UserSelectQuestion,
  getAssessmentScore,
  getInputQuestionAnswer,
  getQuestions,
} from "./utils";
import SelectQuestion from "./SelectQuestion";
import InputQuestion from "./InputQuestion";
import { InputQuestion as InputQuestionType } from "@/data/assessmentData";
import { useEthToUsd } from "@/lib/hooks/useEthToUsd";
import PageOptions from "../Options/PageOptions";
import { OptionArg } from "@/types/option";

export default function PageAssessment({
  option,
  displayOptions,
  completeAssessment,
}: {
  option: OptionArg;
  displayOptions: () => void;
  completeAssessment: () => void;
}) {
  const [isComplete, setIsComplete] = useState(false);
  const [questions, setQuestions] = useState(
    getQuestions(option.side, option.type)
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [render, setRender] = useState(false);
  const [score, setScore] = useState(0);
  const allCorrect = score === questions.length;
  const isLast = questions[currentQuestionIdx].id === questions.slice(-1)[0].id;
  const ethToUsd = useEthToUsd();

  const ethInUsd = useMemo(
    () => (ethToUsd ? Math.round(ethToUsd) : 0),
    [ethToUsd]
  );

  useEffect(() => {
    setRender(true);
  }, []);

  const reset = () => {
    setScore(0);
    setQuestions(getQuestions(option.side, option.type));
    setIsComplete(false);
    setCurrentQuestionIdx(0);
  };

  const saveAnswer = (answer: string) => {
    let isCorrect = false;
    if (questions[currentQuestionIdx].type === "select") {
      isCorrect =
        (questions[currentQuestionIdx] as UserSelectQuestion).data
          .correctAnswer === answer;
    } else {
      isCorrect =
        getInputQuestionAnswer(
          option,
          questions[currentQuestionIdx].data as InputQuestionType,
          ethInUsd
        ).toString() === answer;
    }

    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questions[currentQuestionIdx].id
          ? {
              ...question,
              correct: isCorrect,
              status: "answered",
              userAnswer: answer,
            }
          : question
      )
    );
  };

  const nextStep = () => {
    if (isLast) {
      const score = getAssessmentScore(questions);
      setScore(score);

      if (allCorrect) {
        completeAssessment();
      }

      setIsComplete(true);
    } else {
      setCurrentQuestionIdx((prevIdx) => (prevIdx + 1) % questions.length);
    }
  };

  if (!render) return null;

  return isComplete ? (
    <div className="assessment flex flex-col gap-4 items-center mt-12 mb-8 text-center">
      <p className="flex flex-col gap-2">
        <span className="text-20">Your score</span>
        {score}/{questions.length}
        <span>{allCorrect ? "🥳" : "😔📚"}</span>
      </p>
      {allCorrect ? (
        <button type="button" onClick={displayOptions}>
          Display options
        </button>
      ) : (
        <button type="button" onClick={reset}>
          Try Again
        </button>
      )}
    </div>
  ) : (
    <>
      <h2>Assessment</h2>
      <div className="flex flex-col gap-8 assessment">
        {questions[currentQuestionIdx].type === "select" ? (
          <SelectQuestion
            question={questions[currentQuestionIdx] as UserSelectQuestion}
            saveAnswer={saveAnswer}
          />
        ) : (
          <InputQuestion
            question={questions[currentQuestionIdx] as UserInputQuestion}
            saveAnswer={saveAnswer}
            ethInUsd={ethInUsd}
          />
        )}
        <button
          type="button"
          className="mx-auto disabled:text-light-gray"
          onClick={nextStep}
          disabled={questions[currentQuestionIdx].status === "unanswered"}
        >
          {isLast ? "SEE SCORE" : "NEXT"}
        </button>
      </div>
    </>
  );
}
