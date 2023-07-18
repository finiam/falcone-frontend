import { ReactNode } from "react";

const colors = {
  red: "#cd0101",
  green: "#128a01",
  blue: "#242838",
  black: "#2c2810",
} as const;

export default function ConceptsBoxWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <aside className="flex lg:flex-row gap-8 lg:gap-20 p-5 pb-8 bg-light-blue flex-col">{children}</aside>;
}

export function ConceptsBox({
  color = "black",
  title,
  children,
}: {
  color?: keyof typeof colors;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full concepts-box">
      <h5
        className="text-20 font-500 leading-24 uppercase mb-3"
        style={{ color: colors[color] }}
      >
        {title}
      </h5>
      {children}
    </div>
  );
}
