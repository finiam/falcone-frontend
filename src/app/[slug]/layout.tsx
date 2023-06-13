import ConceptsNav from "@/components/ConceptsNav";
import { getAllPaths } from "@/content/getData";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const paths = getAllPaths();

  return (
    <div className="flex gap-8">
      <section>
        <ConceptsNav paths={paths} />
      </section>

      <main>{children}</main>
    </div>
  );
}
