import AssessmentButton from "./Button";
import Image from "next/image";
import { AnswerOptions } from "./AssessmentLayout";

export default function AssessmentOptions({
  selectAnswer,
}: {
  selectAnswer: (value: AnswerOptions) => void;
}) {
  return (
    <div className="flex gap-5 items-center">
      <AssessmentButton
        handleClick={() => selectAnswer(AnswerOptions.In)}
        className="text-green"
        icon={
          <Image
            src="/in_the_money.png"
            alt="In the money symbol"
            width={56}
            height={56}
          />
        }
      >
        {AnswerOptions.In}
      </AssessmentButton>
      <span className="text-32 uppercase">or</span>
      <AssessmentButton
        handleClick={() => selectAnswer(AnswerOptions.Out)}
        className="text-red"
        icon={
          <Image
            src="/out_of_the_money.png"
            alt="Out of the money symbol"
            width={56}
            height={56}
          />
        }
      >
        {AnswerOptions.Out}
      </AssessmentButton>
    </div>
  );
}
