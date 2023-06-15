import { ReactNode } from "react";

export default function AssessmentButton({
  children,
  className,
  handleClick,
}: {
  children: ReactNode;
  className?: string;
  handleClick: () => void;
}) {
  return (
    <button
      onClick={handleClick}
      className={`flex gap-6 items-center justify-center h-40 w-[447px] bg-white border border-light-gray rounded-sm ${className}`}
    >
      {children}
    </button>
  );
}
