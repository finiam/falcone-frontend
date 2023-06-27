import { getAllPaths, getFileForRoute, sluggify } from "@/content/getData";
import { getOptionArgs } from "@/lib/option";
import ConceptsBoxWrapper, {
  ConceptsBox,
} from "@/modules/Concepts/ConceptsBox";
import ConceptsExampleWrapper, {
  ConceptsExample,
} from "@/modules/Concepts/ConceptsExample";
import FooterNav from "@/modules/Concepts/FooterNav";
import PageOptions from "@/modules/Options/PageOptions";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getFileForRoute(params.slug);

  if (!data) {
    return <p>Page not found</p>;
  }

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <MDXRemote
        source={data.content}
        components={{
          h2: (data) => (
            <h2 id={sluggify(data.children?.toString())}>{data.children}</h2>
          ),
          ConceptsBoxWrapper: ConceptsBoxWrapper,
          ConceptsBox: ConceptsBox,
          ConceptsExampleWrapper: ConceptsExampleWrapper,
          ConceptsExample: ConceptsExample,
          PageOptions: (option) => (
            <PageOptions option={getOptionArgs(option)} />
          ),
        }}
      />
      <FooterNav previousRoute={data.previous} nextRoute={data.next} />
    </>
  );
}

export async function generateStaticParams() {
  const paths = getAllPaths();

  return paths
    .map((group) =>
      group.paths.map((item) => ({
        slug: item.route,
      }))
    )
    .flat();
}
