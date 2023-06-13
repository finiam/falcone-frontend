import ConceptsNav from "@/components/ConceptsNav";
import { getAllPaths, getFile } from "@/content/getData";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function HomePage() {
  const data = await getFile("intro");
  const paths = getAllPaths();

  if (!data) {
    return <p>Page not found</p>;
  }

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <MDXRemote source={data.content} />
      <ConceptsNav paths={paths} />
    </>
  );
}
