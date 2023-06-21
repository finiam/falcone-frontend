"use client";

import { useState } from "react";
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
  // TODO: create store to save selected questions and status, pick new questions
  const [questions, setQuestions] = useState(
    getQuestions(option.side, option.type)
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const allCorrect = score === questions.length;
  const isLast = questions[currentQuestionIdx].id === questions.slice(-1)[0].id;

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

  return isComplete ? (
    <>
      <div>
        <span>
          {score}/{questions.length}
        </span>
      </div>
      {allCorrect ? (
        <button onClick={reset}>Display options</button>
      ) : (
        <button onClick={reset}>try again</button>
      )}
    </>
  ) : (
    <div className="flex flex-col gap-8">
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
        onClick={nextStep}
        disabled={questions[currentQuestionIdx].status === "unanswered"}
      >
        {isLast ? "SEE SCORE" : "NEXT"}
      </button>
    </div>
  );
}
