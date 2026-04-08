import fs from "fs";
import path from "path";
import matter from "gray-matter";

const artifactsDir = "C:\\Users\\naoki\\.gemini\\antigravity\\brain\\a40b06fb-d36f-4e61-ac2c-83b56cfcd779";
const ogpDir = path.join(process.cwd(), "public", "images", "ogp");
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
const artifacts = fs.readdirSync(artifactsDir).filter(f => f.endsWith(".png"));

const mapping = {
  "over-35-career-change": "over_35_career_change",
  "resume-for-agents": "resume_for_agents",
  "resume-writing-guide": "resume_writing_guide",
  "venture-to-enterprise": "venture_to_enterprise",
  "jtc-complete-guide": "jtc_complete_guide"
};

for (const slug of Object.keys(mapping)) {
  const prefix = mapping[slug];
  const matched = artifacts.filter(f => f.startsWith(prefix)).sort().reverse();
  if (matched.length > 0) {
    const latest = matched[0];
    const src = path.join(artifactsDir, latest);
    const dest = path.join(ogpDir, `${slug}.png`);
    fs.copyFileSync(src, dest);
    console.log(`Copied ${latest} to ${slug}.png`);
    
    const mdFile = mdFiles.find(f => path.parse(f).name === slug);
    if (mdFile) {
      const content = fs.readFileSync(mdFile, "utf8");
      const parsed = matter(content);
      const imagePath = `/images/ogp/${slug}.png`;
      if (parsed.data.image !== imagePath) {
        parsed.data.image = imagePath;
        const newContent = matter.stringify(parsed.content, parsed.data);
        fs.writeFileSync(mdFile, newContent, "utf8");
        console.log(`Updated frontmatter for ${slug}.md`);
      }
    }
  }
}
