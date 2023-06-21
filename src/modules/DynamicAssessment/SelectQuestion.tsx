"use client";

import { UserSelectQuestion } from "./utils";

export default function SelectQuestion({
  question,
  saveAnswer,
}: {
  question: UserSelectQuestion;
  saveAnswer: (answer: string) => void;
}) {
  const handleClick = (id: string) => {
    if (question.status === "unanswered") {
      saveAnswer(id);
    }
  };

  return (
    <>
      <h4>{question.data.question}</h4>
      <div className="flex flex-col gap-6">
        {question.data.options.map(({ id, value }) => (
          <button
            disabled={question.status === "answered"}
            onClick={() => handleClick(id)}
            key={id}
            className={`text-left w-full px-4 py-2 rounded-md border border-light-gray ${
              question.status === "answered" &&
              (question.data.correctAnswer === id
                ? "bg-light-green border-green"
                : question.userAnswer === id
                ? "bg-light-red border-red"
                : "")
            }`}
          >
            {value}
          </button>
        ))}
      </div>
    </>
  );
}
