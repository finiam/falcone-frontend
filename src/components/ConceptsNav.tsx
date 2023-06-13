import { getAllPaths } from "@/content/getData";
import Link from "next/link";

export default function ConceptsNav({
  paths,
}: {
  paths: ReturnType<typeof getAllPaths>;
}) {
  return (
    <ul>
      {paths.map((path) => (
        <li key={path.route} className="mb-2">
          <Link href={`/${path.route}`}>{path.data?.title}</Link>
          <ul className="pl-2">
            {path.sections?.map((section) => (
              <li key={`${path}${section.slug}`}>
                <Link href={`/${path.route}#${section.slug}`}>
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
