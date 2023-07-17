import { ReactNode } from "react";

export default function LiquidityPoolExample({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="p-8 mt-4 mb-14 rounded-lg border border-light-gray pool-example">
      <h4>{title}</h4>
      {children}
    </div>
  );
}
