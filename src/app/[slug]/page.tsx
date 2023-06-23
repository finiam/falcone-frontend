import ScenarioGraph from "@/components/ScenarioGraph";
import { getAllPaths, getFileForRoute, sluggify } from "@/content/getData";
import ConceptsBoxWrapper, {
  ConceptsBox,
} from "@/modules/Concepts/ConceptsBox";
import ConceptsExampleWrapper, {
  ConceptsExample,
} from "@/modules/Concepts/ConceptsExample";
import FooterNav from "@/modules/Concepts/FooterNav";
import PageAssessment from "@/modules/DynamicAssessment/PageAssessment";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getFileForRoute(params.slug);

  const option = {
    side: params.slug === "buying" ? "long" : "short",
    type: "call",
  };

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
          PageAssessment: PageAssessment,
        }}
      />
      {/* <PageAssessment
        option={{
          side: params.slug.includes("buying") ? "long" : "short",
          type: "call",
        }}
      /> */}
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
