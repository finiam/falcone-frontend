import { ReactNode } from "react";

export default function ConceptsLayout({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="lg:grid grid-cols-[234px,_1fr] gap-[106px]">
      <aside className="hidden lg:block w-[234px]">{sidebar}</aside>
      <main className="px-4 lg:px-0 pb-20">{children}</main>
    </div>
  );
}
