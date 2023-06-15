import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import path from "path";

function getSectionsFromContent(content: string) {
  const h2Match = /\n#{2} ([\s\S]*?)\n/gm;

  return content.match(h2Match)?.map((item) => {
    const title = item.replace("##", "").trim();

    return {
      title,
      slug: sluggify(title),
    };
  });
}

function getDirPath(filePath = "") {
  return path.join(process.cwd(), `src/content/${filePath}`);
}

export async function getFile(slug: string) {
  const dir = readdirSync(getDirPath());
  const match = dir.find((item) => item.includes(` ${slug}.mdx`));
  const filePath = getDirPath(match);

  try {
    const file = readFileSync(filePath, "utf8");

    return matter(file);
  } catch {
    return null;
  }
}

export function getAllPaths() {
  const dir = readdirSync(getDirPath());

  try {
    return dir
      .filter((file) => path.extname(file).toLowerCase() === ".mdx")
      .map((item) => {
        const filePath = getDirPath(item);
        const file = readFileSync(filePath, "utf-8");

        console.log(item)

        const { data, content } = matter(file);
        const route = item.replace(/.mdx$|\d/g, "").trim();

        return {
          data,
          route: route === "intro" ? "/" : route,
          sections: getSectionsFromContent(content),
        };
      });
  } catch (err) {
    console.log(err);

    return [];
  }
}

export function sluggify(str = "") {
  return str.replaceAll(/\s/g, "-").toLowerCase();
}
