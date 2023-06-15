import AssessmentButton from "./Button";
import Image from "next/image";
import InTheMoneyLabel from "@/components/InTheMoneyLabel";
import OutOfTheMoneyLabel from "@/components/OutOfTheMoneyLabel";
import { AnswerOptions } from "./AssessmentLayout";

export default function AssessmentOptions({
  selectAnswer,
}: {
  selectAnswer: (value: AnswerOptions) => void;
}) {
  return (
    <div className="flex gap-5 items-center">
      <AssessmentButton handleClick={() => selectAnswer(AnswerOptions.In)}>
        <InTheMoneyLabel />
      </AssessmentButton>
      <span className="text-32 uppercase">or</span>
      <AssessmentButton handleClick={() => selectAnswer(AnswerOptions.Out)}>
        <OutOfTheMoneyLabel />
      </AssessmentButton>
    </div>
  );
}
