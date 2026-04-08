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

fs.mkdirSync(ogpDir, { recursive: true });

const artifacts = fs.readdirSync(artifactsDir).filter(f => f.endsWith(".png"));

console.log(`Found ${artifacts.length} generated images.`);

const mapping = {
  "career_story": "career-story",
  "dx_talent_salary": "dx-talent-salary",
  "environment_decides_salary": "environment-decides-salary",
  "from_zero_to_hero": "from-zero-to-hero",
  "keio_to_venture": "keio-to-venture",
  "two_billion_yen_night": "two-billion-yen-night",
  "venture_vs_enterprise_reality": "venture-vs-enterprise-reality",
  "how_to_start_sidejob": "how-to-start-sidejob",
  "agent_guide": "agent-guide",
  "agent_review_8services": "agent-review-8services",
  "embarrassing_first_month": "embarrassing-first-month",
  "high_salary_job_change": "high-salary-job-change",
  "job_change_count": "job-change-count",
  "jtc_complete_guide": "jtc-complete-guide",
  "jtc_regret_checklist": "jtc-regret-checklist",
  "jtc_salary_30s": "jtc-salary-30s",
  "jtc_yurui_reality": "jtc-yurui-reality",
  "over_35_career_change": "over-35-career-change",
  "resume_for_agents": "resume-for-agents",
  "resume_writing_guide": "resume-writing-guide",
  "venture_to_enterprise": "venture-to-enterprise"
};

for (const artifact of artifacts) {
  // Artifact names are like career_story_1234567.png
  let matchName = null;
  for (const key of Object.keys(mapping)) {
    if (artifact.startsWith(key)) {
      matchName = mapping[key];
      break;
    }
  }

  if (matchName) {
    const srcPath = path.join(artifactsDir, artifact);
    const destName = `${matchName}.png`;
    const destPath = path.join(ogpDir, destName);
    
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${artifact} -> ${destName}`);
    
    // Find md file
    const mdFile = mdFiles.find(f => path.parse(f).name === matchName);
    if (mdFile) {
      const content = fs.readFileSync(mdFile, "utf8");
      const parsed = matter(content);
      const imagePath = `/images/ogp/${destName}`;
      if (parsed.data.image !== imagePath) {
        parsed.data.image = imagePath;
        const newContent = matter.stringify(parsed.content, parsed.data);
        fs.writeFileSync(mdFile, newContent, "utf8");
        console.log(`  Updated frontmatter for ${matchName}`);
      }
    }
  }
}
