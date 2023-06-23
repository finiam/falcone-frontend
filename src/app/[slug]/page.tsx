import { getAllPaths, getFileForRoute, sluggify } from "@/content/getData";
import { getRawAvailableOptions } from "@/lib/api";
import ConceptsBoxWrapper, {
  ConceptsBox,
} from "@/modules/Concepts/ConceptsBox";
import ConceptsExampleWrapper, {
  ConceptsExample,
} from "@/modules/Concepts/ConceptsExample";
import FooterNav from "@/modules/Concepts/FooterNav";
import PageOptions from "@/modules/Options/PageOptions";
import { OptionArg, OptionSide, OptionType } from "@/types/option";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getFileForRoute(params.slug);
  const { data: rawOptionsData } = await getRawAvailableOptions();

  if (!data) {
    return <p>Page not found</p>;
  }

  const displayOptions = [
    "buying-call",
    "buying-put",
    "selling-call",
    "selling-put",
  ].includes(params.slug);

  const [side, type] = displayOptions ? params.slug.split("-") : [];

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
        }}
      />
      {displayOptions && (
        <PageOptions
          rawData={rawOptionsData}
          option={
            {
              side: side === "buying" ? OptionSide.Long : OptionSide.Short,
              type: type === "call" ? OptionType.Call : OptionType.Put,
            } as OptionArg
          }
        />
      )}
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
