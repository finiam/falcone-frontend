import { getAllPaths } from "@/content/getData";
import ConceptsLayout from "@/modules/Concepts/ConceptsLayout";
import ConceptsSidebar from "@/modules/Concepts/ConceptsSidebar";
import NotFoundMessage from "@/components/NotFoundMessage";

export default function NotFound() {
  const paths = getAllPaths();

  return (
    <ConceptsLayout sidebar={<ConceptsSidebar paths={paths} />}>
      <article className="concepts-article">
        <NotFoundMessage />
      </article>
    </ConceptsLayout>
  );
}
