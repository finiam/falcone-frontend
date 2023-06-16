import { ReactNode } from "react";
import { AnswerOptions } from "@/data/assessments";

export default function AssessmentButton({
  children,
  className,
  handleClick,
  type,
}: {
  children: ReactNode;
  className?: string;
  handleClick: () => void;
  type: AnswerOptions;
}) {
  return (
    <button
      onClick={handleClick}
      className={`flex gap-6 items-center justify-center h-40 w-[447px] bg-white border border-light-gray rounded-sm ${
        type === AnswerOptions.In
          ? "hover:bg-light-green"
          : "hover:bg-light-red"
      } ${className}`}
    >
      {children}
    </button>
  );
}
