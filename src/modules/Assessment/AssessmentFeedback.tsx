import InTheMoneyLabel from "@/components/InTheMoneyLabel";
import { Answer } from "./AssessmentLayout";
import OutOfTheMoneyLabel from "@/components/OutOfTheMoneyLabel";
import Image from "next/image";
import { AnswerStatus } from "./Assessment";
import { AnswerOptions } from "@/data/assessments";

export default function AssessmentFeedback({
  answerStatus,
  feedback,
  position,
}: {
  answerStatus: AnswerStatus;
  feedback: string;
  position: AnswerOptions;
}) {
  if (answerStatus === "unanswered") return null;

  return (
    <div className="max-w-full w-[981px] h-40 grid grid-cols-[107px,_max-content,_1fr] gap-x-10 border border-light-gray rounded-sm bg-white overflow-hidden">
      <div
        className={`h-full w-full text-white flex items-center justify-center ${
          answerStatus === "correct" ? "bg-green" : "bg-red"
        }`}
      >
        <Image
          src={answerStatus === "correct" ? "/check.svg" : "/cross.svg"}
          alt=""
          width={35}
          height={35}
        />
      </div>
      {position === AnswerOptions.In ? (
        <InTheMoneyLabel />
      ) : (
        <OutOfTheMoneyLabel />
      )}
      <div className="flex items-center justify-center">
        <span className="text-20 text-dark-gray leading-24 py-4 px-8">
          {feedback}
        </span>
      </div>
    </div>
  );
}
