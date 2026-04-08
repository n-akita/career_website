import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

function getMdFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getMdFiles(fullPath, files);
    } else if (fullPath.endsWith('.md') || fullPath.endsWith('.mdx')) {
      files.push(fullPath);
    }
  });
  return files;
}

const mdFiles = getMdFiles(contentDir);
const results = mdFiles.map(file => {
  const content = fs.readFileSync(file, "utf8");
  const parsed = matter(content);
  return {
    file: file.replace(contentDir, "").replace(/\\/g, "/"),
    basename: path.parse(file).name,
    title: parsed.data.title || "",
    description: parsed.data.description || ""
  };
});

fs.writeFileSync("md_info.json", JSON.stringify(results, null, 2), "utf8");
console.log("Extracted info for", results.length, "files");
