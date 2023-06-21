"use client";

import { UserInputQuestion } from "./utils";

export default function InputQuestion({
  question,
  saveAnswer,
}: {
  question: UserInputQuestion;
  saveAnswer: (answer: string) => void;
}) {
  console.log(question.data);

  const handleSubmit = () => {
    saveAnswer("");
  };
  return <button onClick={handleSubmit}>New question</button>;
}
