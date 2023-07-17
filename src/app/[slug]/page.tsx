import { getAllPaths, getFileForRoute, sluggify } from "@/content/getData";
import { getOptionArgs } from "@/lib/option";
import ConceptsBoxWrapper, {
  ConceptsBox,
} from "@/modules/Concepts/ConceptsBox";
import ConceptsExampleWrapper, {
  ConceptsExample,
} from "@/modules/Concepts/ConceptsExample";
import FooterNav from "@/modules/Concepts/FooterNav";
import LiquidityPoolExample from "@/modules/Concepts/LiquidityPoolExample";
import ScenarioCard from "@/modules/Concepts/ScenarioCard";
import PageOptions from "@/modules/Options/PageOptions";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const routeData = await getFileForRoute(params.slug);

  if (routeData) {
    return {
      title: `Falcone - ${routeData?.data.title}`,
    };
  }

  return {
    title: `404 - Falcone`,
  };
}

export default async function Page({ params }: { params: Params }) {
  const data = await getFileForRoute(params.slug);

  if (!data) {
    notFound();
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
          PageOptions: ({ option }) => (
            <PageOptions option={getOptionArgs(option)} />
          ),
          LiquidityPoolExample: LiquidityPoolExample,
          ScenarioCard: ScenarioCard,
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
