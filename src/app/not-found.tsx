import { getAllPaths } from "@/content/getData";
import ConceptsLayout from "@/modules/Concepts/ConceptsLayout";
import ConceptsSidebar from "@/modules/Concepts/ConceptsSidebar";
import { Metadata } from "next";
import Link from "next/link";

export default function NotFound() {
  const paths = getAllPaths();

  return (
    <ConceptsLayout sidebar={<ConceptsSidebar paths={paths} />}>
      <article className="concepts-article">
        <div className="lg:mt-24">
          <p className="text-24 text-blue mb-8">
            We couldn&apos;t find what you were looking for.
          </p>
          <Link href={"/"} className="underline">
            Home
          </Link>
        </div>
      </article>
    </ConceptsLayout>
  );
}
