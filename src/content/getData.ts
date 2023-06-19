import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import path from "path";

export function sluggify(str = "") {
  return str.replaceAll(/\s/g, "-").toLowerCase();
}

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

function getRouteFromFileName(name?: string) {
  if (!name) return null;

  const route = name.replace(/.mdx$|\d/g, "").trim();

  return route === "intro" ? "/" : route;
}

export function getFileData(fileName?: string) {
  if (!fileName) return null;

  const filePath = getDirPath(fileName);
  const file = readFileSync(filePath, "utf8");

  return { ...matter(file), route: getRouteFromFileName(fileName) };
}

export async function getFileForRoute(slug: string) {
  const dir = readdirSync(getDirPath()).filter(
    (file) => path.extname(file).toLowerCase() === ".mdx"
  );
  const matchIdx = dir.findIndex((item) => item.includes(` ${slug}.mdx`));
  const routeFile = getFileData(dir[matchIdx]);

  if (!routeFile) {
    return null;
  }

  try {
    const previous = getFileData(dir?.[matchIdx - 1]);
    const next = getFileData(dir?.[matchIdx + 1]);

    return { ...routeFile, previous, next };
  } catch (err) {
    console.log(err);
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

        const { data, content } = matter(file);
        const route = getRouteFromFileName(item);

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
