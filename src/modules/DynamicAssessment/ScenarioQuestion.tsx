import { useEthToUsd } from "@/lib/hooks/useEthToUsd";
import { genResultForPoint, useOptionScenario } from "@/lib/optionScenario";
import { FormEvent, useState } from "react";

const Result = ({ correct }: { correct: boolean }) => {
  const colorClass = correct
    ? "bg-light-green border-green"
    : "bg-light-red border-red";

  return (
    <div className={`rounded-md border ${colorClass} p-4`}>
      {correct ? "Correct! Buy this option" : "Incorrect"}
    </div>
  );
};

export default function ScenarioQuestion({
  saveAssessmentAnswer,
}: {
  saveAssessmentAnswer: (val: boolean) => void;
}) {
  const option = useOptionScenario((state) => state.originalOption);
  const ethToUsd = useEthToUsd();

  const [status, setStatus] = useState<"correct" | "incorrect" | "idle">(
    "idle"
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const answer = data.get("answer") as string;
    const result = genResultForPoint(Number(answer), option, 1, ethToUsd);

    setStatus(result > 0 ? "correct" : "incorrect");
    saveAssessmentAnswer(result > 0);
  }

  return (
    <section className="flex flex-col mt-8 gap-2">
      <p className="text-20 mb-0">
        At what price does ETH need to be trading, in order for you to make a
        profit?
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex justify-between px-4 py-2 rounded-md border enabled:shadow-sm disabled:bg-offwhite bg-white border-light-gray"
      >
        <label className="text-16 flex gap-2 items-center">
          At least
          <input
            type="number"
            name="answer"
            placeholder="Enter your answer here"
            className="text-16 p-1 pl-2 rounded-sm appearance-none focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="text-16 uppercase opacity-70 tracking-wider"
        >
          Submit
        </button>
      </form>
      {status !== "idle" && <Result correct={status === "correct"} />}
    </section>
  );
}
