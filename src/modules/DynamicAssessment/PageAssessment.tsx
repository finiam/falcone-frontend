"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
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
import { LiveOption, OptionArg } from "@/types/option";
import ScenarioGraph from "./ScenarioGraph";

const LOCAL_STORAGE_KEY_BASE = "falcone";

export default function PageAssessment({
  optionType,
  filteredOptions,
  children,
}: {
  optionType: OptionArg;
  filteredOptions: LiveOption[];
  children: ReactNode;
}) {
  const [isComplete, setIsComplete] = useState(true);
  const [questions, setQuestions] = useState(
    getQuestions(optionType.side, optionType.type)
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [render, setRender] = useState(false);
  const ethToUsd = useEthToUsd();

  const optionLocalStorageKey = `${LOCAL_STORAGE_KEY_BASE}_${optionType.side}_${optionType.type}`;
  const score = 4 || getAssessmentScore(questions);
  const allCorrect = score === questions.length;
  const isLast = questions[currentQuestionIdx].id === questions.slice(-1)[0].id;

  const ethInUsd = useMemo(
    () => (ethToUsd ? Math.round(ethToUsd) : 0),
    [ethToUsd]
  );

  useEffect(() => {
    setRender(true);
  }, []);

  const reset = () => {
    setQuestions(getQuestions(optionType.side, optionType.type));
    setIsComplete(false);
    setCurrentQuestionIdx(0);
    localStorage.removeItem(optionLocalStorageKey);
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
          optionType,
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

  const saveAssessmentAnswer = (correct: boolean) => {
    const res = questions.map((question) =>
      question.id === "scenario"
        ? {
            ...question,
            correct,
            status: "answered",
          }
        : question
    ) as typeof questions;

    setQuestions(res);
    setIsComplete(true);
  };

  const nextStep = () => {
    setCurrentQuestionIdx((prevIdx) => (prevIdx + 1) % questions.length);
  };

  useEffect(() => {
    const local = localStorage.getItem(optionLocalStorageKey);

    if (!local) return;

    setIsComplete(true);
    setQuestions((state) =>
      state.map((item) => ({
        ...item,
        correct: true,
      }))
    );
  }, []);

  useEffect(() => {
    if (allCorrect) {
      localStorage.setItem(optionLocalStorageKey, "true");
    }
  }, [questions]);

  const QuestionComponent = () => {
    switch (questions[currentQuestionIdx].type) {
      case "scenario":
        return (
          <ScenarioGraph
            option={filteredOptions?.[0]}
            saveAssessmentAnswer={saveAssessmentAnswer}
            ethToUsd={ethInUsd}
          />
        );
      case "input":
        return (
          <InputQuestion
            question={questions[currentQuestionIdx] as UserInputQuestion}
            saveAnswer={saveAnswer}
            ethInUsd={ethInUsd}
          />
        );
      case "select":
        return (
          <SelectQuestion
            question={questions[currentQuestionIdx] as UserSelectQuestion}
            saveAnswer={saveAnswer}
          />
        );
    }
  };

  if (!render) return null;

  return isComplete ? (
    <div className="assessment flex flex-col gap-4 items-center mt-12 mb-8 text-center">
      <p className="flex flex-col gap-2 mb-0">
        <span className="text-20">Your score</span>
        {score}/{questions.length}
        <span>{allCorrect ? "🥳" : "😔📚"}</span>
      </p>
      {score === questions.length ? (
        <>
          <p className="text-16 text-center">
            Well done! You know your stuff. You can go ahead and buy some real
            options.
          </p>
          {children}
        </>
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
        <QuestionComponent />

        {!isLast && (
          <button
            type="button"
            className="mx-auto disabled:text-light-gray"
            onClick={nextStep}
            disabled={questions[currentQuestionIdx].status === "unanswered"}
          >
            NEXT
          </button>
        )}
      </div>
    </>
  );
}
