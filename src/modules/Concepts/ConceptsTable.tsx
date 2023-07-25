import { getAllPaths } from "@/content/getData";
import Link from "next/link";

export default function ConceptsTable({
  paths,
}: {
  paths: ReturnType<typeof getAllPaths>;
}) {
  const pathsWithoutIntro = paths.slice(1);

  return (
    <section className="bg-light-blue p-5 pb-6 flex flex-col gap-8">
      <h2 className="text-32 lg:text-48 font-yeseva text-blue">Fundamentals</h2>
      <div className="flex justify-between flex-wrap">
        <ul className="flex w-full gap-28">
          {pathsWithoutIntro.map((path) => (
            <li key={path.section}>
              <Link
                href={`/${path.paths?.[0].route}`}
                className="block text-24 font-500 text-blue mb-5"
              >
                {path.section}
              </Link>
              <ul className="flex flex-col gap-6">
                {path.paths?.slice(1).map((item) => (
                  <li key={`${item.route}`}>
                    <Link
                      href={`/${item.route}`}
                      className="text-16 font-500 text-blue uppercase underline opacity-60 hover:text-orange hover:opacity-100"
                    >
                      {item.data.title}
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
