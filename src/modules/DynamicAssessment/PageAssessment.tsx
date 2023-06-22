"use client";

import { useEffect, useState } from "react";
import {
  UserInputQuestion,
  UserSelectQuestion,
  getAssessmentScore,
  getInputQuestionAnswer,
  getQuestions,
} from "./utils";
import SelectQuestion from "./SelectQuestion";
import InputQuestion from "./InputQuestion";
import { InputQuestion as InputQuestionType } from "@/data/mockAssessments";

export default function PageAssessment({
  option = { side: "long", type: "call" },
}: {
  option?: { side: "long" | "short"; type: "call" | "put" };
}) {
  // TODO: get status from localStorage
  const [isComplete, setIsComplete] = useState(false);
  const [questions, setQuestions] = useState(
    getQuestions(option.side, option.type)
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [render, setRender] = useState(false);
  const [score, setScore] = useState(0);
  const allCorrect = score === questions.length;
  const isLast = questions[currentQuestionIdx].id === questions.slice(-1)[0].id;

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
          questions[currentQuestionIdx].data as InputQuestionType
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
        // TODO: update local storage
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
        <button type="button" onClick={() => console.log("display options")}>
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
          />
        )}
        <button
          type="button"
          className="disabled:text-light-gray"
          onClick={nextStep}
          disabled={questions[currentQuestionIdx].status === "unanswered"}
        >
          {isLast ? "SEE SCORE" : "NEXT"}
        </button>
      </div>
    </>
  );
}
