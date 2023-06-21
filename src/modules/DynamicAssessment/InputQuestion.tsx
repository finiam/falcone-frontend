"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { UserInputQuestion } from "./utils";
import { useEthToUsd } from "@/lib/hooks/useEthToUsd";

export default function InputQuestion({
  question,
  saveAnswer,
}: {
  question: UserInputQuestion;
  saveAnswer: (answer: string) => void;
}) {
  const [input, setInput] = useState<string>();
  const ethPrice = useEthToUsd();

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (input) saveAnswer(input);
  };

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) =>
    setInput(ev.target.value);

  return (
    <div>
      <p>
        {question.data.question({
          ethPrice,
          ...question.data,
        })}
      </p>
      <form onSubmit={handleSubmit}>
        <input onChange={handleChange} type="number" step="0.001" />
        <button type="submit" disabled={!input || question.correct}>
          Submit
        </button>
      </form>
      {question.status === "answered" &&
        (question.correct ? <>GOOD JOB</> : <>TRY AGAIN</>)}
    </div>
  );
}
