import { getAllPaths } from "@/content/getData";
import Image from "next/image";
import Link from "next/link";

export default function ConceptsSidebar({
  paths,
}: {
  paths: ReturnType<typeof getAllPaths>;
}) {
  return (
    <section className="h-screen px-5 pt-11 bg-light-blue border-r border-[#BFC9CE] sticky bottom-0 top-0">
      <section className="flex items-center justify-between mb-12">
        <Link href={"/"} className="font-yeseva text-32 leading-1 text-blue">
          Falcone
        </Link>
        <figure className="absolute -right-10 w-20">
          <Image
            src={"/falcone_logo.png"}
            alt="Falcone logo"
            width={164}
            height={94}
          />
        </figure>
      </section>

      <nav>
        <ul className="flex flex-col gap-8 list-decimal marker:text-orange marker:text-16 marker:font-600 marker:mr-4 list-inside">
          {paths.map((group, idx) => (
            <li key={group.section} className="text-12">
              <Link
                href={`/${group.paths?.[0].route}`}
                className="pl-3 font-600 uppercase text-blue hover:text-orange hover:opacity-100"
              >
                {group.section}
              </Link>
              <ul className="pl-8 flex flex-col gap-3 mt-5">
                {group.paths.map((path) => (
                  <li key={path.route}>
                    <Link
                      href={path.route as string}
                      className="font-500 uppercase text-blue opacity-60 hover:text-orange hover:opacity-100"
                    >
                      {path.data.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
