import InTheMoneyLabel from "@/components/InTheMoneyLabel";
import { Answer, AnswerStatus } from "./AssessmentLayout";
import OutOfTheMoneyLabel from "@/components/OutOfTheMoneyLabel";
import Image from "next/image";

export default function AssessmentFeedback({
  answerStatus,
  answer,
}: {
  answerStatus: AnswerStatus;
  answer: Answer;
}) {
  if (answerStatus === "unanswered") return null;

  return (
    <div className="max-w-full w-[981px] h-40 grid grid-cols-[107px,_1fr,_1fr] gap-x-10 border border-light-gray rounded-sm bg-white overflow-hidden">
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
      {answerStatus === "correct" ? (
        <InTheMoneyLabel />
      ) : (
        <OutOfTheMoneyLabel />
      )}
      <div className="flex items-center justify-center">
        <span className="text-20 text-dark-gray leading-24 p-4">
          {answer.description}
        </span>
      </div>
    </div>
  );
}
