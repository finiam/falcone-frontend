import { ReactNode } from "react";
import Image from "next/image";

export default function ConceptsExampleWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <aside className="flex flex-col lg:flex-row gap-5">{children}</aside>;
}

export function ConceptsExample({
  type,
  header,
  children,
}: {
  type: "In-the-money" | "Out-of-the-money";
  header: string;
  children: ReactNode;
}) {
  const textColor = type === "In-the-money" ? "#128a01" : "#cd0101";
  const bgColor = type === "In-the-money" ? "#EDFFE4" : "#FFF2F2";
  const iconName = type === "In-the-money" ? "profit" : "loss";

  return (
    <section className="bg-white w-full concepts-example border border-[#E4E7DB]">
      <header className="relative mb-6" style={{ background: bgColor }}>
        <figure className="absolute left-4 top-0 bottom-0 m-auto flex items-center">
          <Image
            src={`/icons/${iconName}.svg`}
            alt="Loss"
            width={56}
            height={56}
          />
        </figure>
        <p
          className="uppercase text-16 leading-24 text-center m-0"
          style={{ color: textColor }}
        >
          {type}
        </p>
      </header>
      <div className="px-5">
        <p className="uppercase text-20 font-600" style={{ color: textColor }}>
          {header}
        </p>
        {children}
      </div>
    </section>
  );
}
