"use client";

import { useEffect, useMemo, useState } from "react";
import { UserSelectQuestion, getAssessmentScore, getQuestions } from "./utils";
import SelectQuestion from "./SelectQuestion";
import InputQuestion from "./InputQuestion";
import { useEthToUsd } from "@/lib/hooks/useEthToUsd";
import ScenarioGraph from "@/components/ScenarioGraph";

export type OptionArg = { side: "long" | "short"; type: "call" | "put" };

export default function PageAssessment({
  option = { side: "long", type: "call" },
}: {
  option: OptionArg;
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

  const saveSelectAnswer = (answer: string) => {
    const isCorrect =
      (questions[currentQuestionIdx] as UserSelectQuestion).data
        .correctAnswer === answer;

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
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === "scenario"
          ? {
              ...question,
              correct,
              status: "answered",
            }
          : question
      )
    );
  };

  /* const saveAnswer = (answer: string) => {
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
  }; */

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
      <div className="flex flex-col gap-8">
        {questions[currentQuestionIdx].type === "select" ? (
          <div className="assessment">
            <SelectQuestion
              question={questions[currentQuestionIdx] as UserSelectQuestion}
              saveAnswer={saveSelectAnswer}
            />
          </div>
        ) : (
          <ScenarioGraph
            optionType={option}
            saveAssessmentAnswer={saveAssessmentAnswer}
          />
        )}
        <div className="assessment">
          <button
            type="button"
            className="disabled:text-light-gray"
            onClick={nextStep}
            disabled={questions[currentQuestionIdx].status === "unanswered"}
          >
            {isLast ? "SEE SCORE" : "NEXT"}
          </button>
        </div>
      </div>
    </>
  );
}

/* 
<InputQuestion
            question={questions[currentQuestionIdx] as UserInputQuestion}
            saveAnswer={saveAnswer}
            ethInUsd={ethInUsd}
          />
*/
