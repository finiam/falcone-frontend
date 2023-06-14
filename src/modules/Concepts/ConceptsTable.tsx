import { getAllPaths } from "@/content/getData";
import Link from "next/link";

export default function ConceptsTable({
  paths,
}: {
  paths: ReturnType<typeof getAllPaths>;
}) {
  const pathsWithoutIntro = paths.slice(1);

  return (
    <section className="bg-light-blue p-5 flex flex-col gap-8">
      <h2 className="text-48 font-yeseva text-blue">Fundamentals</h2>
      <div className="flex justify-between flex-wrap">
        <ul className="flex w-full gap-20">
          {pathsWithoutIntro.map((path) => (
            <li key={path.route}>
              <Link
                href={`/${path.route}`}
                className="block text-24 font-500 text-blue mb-5"
              >
                {path.data?.title}
              </Link>
              <ul className="flex flex-col gap-6">
                {path.sections?.map((section) => (
                  <li key={`${path}${section.slug}`}>
                    <Link
                      href={`/${path.route}#${section.slug}`}
                      className="text-16 font-500 text-blue uppercase underline opacity-60 hover:text-orange hover:opacity-100"
                    >
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
