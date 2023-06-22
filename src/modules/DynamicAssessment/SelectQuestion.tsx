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
      <p className="mb-0">{question.data.question}</p>
      <div className="flex flex-col gap-6">
        {question.data.options.map(({ id, value }) => (
          <button
            type="button"
            disabled={question.status === "answered"}
            onClick={() => handleClick(id)}
            key={id}
            data-correct={
              question.status === "answered" &&
              question.data.correctAnswer === id
            }
            data-incorrect={
              question.userAnswer === id && question.data.correctAnswer !== id
            }
            className="text-left w-full option"
          >
            {value}
          </button>
        ))}
      </div>
    </>
  );
}
