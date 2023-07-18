import { getAllPaths, getFileForRoute } from "@/content/getData";
import ConceptsLayout from "@/modules/Concepts/ConceptsLayout";
import Greeting from "@/modules/Concepts/Greeting";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import ConceptsTable from "@/modules/Concepts/ConceptsTable";

export default async function HomePage() {
  const data = await getFileForRoute("intro");
  const paths = getAllPaths();

  return (
    <>
      <ConceptsLayout
        sidebar={
          <figure className="pt-24 w-fit mx-auto">
            <Image
              src={"/falcone_logo.png"}
              alt="Falcone logo"
              width={164}
              height={94}
            />
          </figure>
        }
      >
        <article className="flex flex-col lg:gap-12 gap-6 pt-5 max-w-[941px]">
          <Greeting />
          <div className="concepts-article">
            {/* @ts-expect-error Server Component */}
            <MDXRemote source={data.content} />
          </div>
          <ConceptsTable paths={paths} />
        </article>
      </ConceptsLayout>
    </>
  );
}
