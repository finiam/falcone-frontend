"use client";

import { genResultForPoint, useOptionScenario } from "@/lib/stores/useScenario";
import { ChangeEvent, FormEvent, useState } from "react";

export default function ScenarioQuestion({
  saveAssessmentAnswer,
  ethToUsd,
}: {
  saveAssessmentAnswer: (val: boolean) => void;
  ethToUsd: number;
}) {
  const option = useOptionScenario((state) => state.originalOption);
  const [input, setInput] = useState<string>();

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) =>
    setInput(ev.target.value);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = genResultForPoint(Number(input), option, 1, ethToUsd);

    saveAssessmentAnswer(result > 0);
  }

  return (
    <section className="flex flex-col mt-8 gap-2">
      <p className="text-20">
        At what price does ETH need to be trading, in order for you to make a
        profit?
      </p>
      <form onSubmit={handleSubmit} className="w-fit mx-auto flex gap-4">
        <label htmlFor="answer" className="text-16 self-center">
          At {option.isCall ? "least" : "most"}
        </label>
        <input
          id="answer"
          type="number"
          name="answer"
          placeholder="Enter your answer here"
          className="rounded-md border border-light-gray px-4 disabled:bg-white mr-4"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="text-16 uppercase opacity-70 tracking-wider"
          disabled={!input}
        >
          Submit
        </button>
      </form>
    </section>
  );
}
