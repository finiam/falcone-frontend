import { ReactNode } from "react";

export default function ScenarioCard({ children }: { children: ReactNode }) {
  return (
    <div className="px-5 py-3 mb-2 rounded-md border border-light-gray bg-light-blue example-scenario">
      {children}
    </div>
  );
}
