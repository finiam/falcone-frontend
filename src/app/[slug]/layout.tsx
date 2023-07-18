import Header from "@/components/Header";
import { getAllPaths } from "@/content/getData";
import ConceptsLayout from "@/modules/Concepts/ConceptsLayout";
import ConceptsSidebar from "@/modules/Concepts/ConceptsSidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const paths = getAllPaths();

  return (
    <ConceptsLayout sidebar={<ConceptsSidebar paths={paths} />}>
      <article className="concepts-article mt-8 lg:m-0">
        <Header />
        {children}
      </article>
    </ConceptsLayout>
  );
}
