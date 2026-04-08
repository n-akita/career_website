import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Assuming we use the existing key if allowed, or it's a proxy key they set up for API usage
const API_KEY = "AIzaSyCbizOk97rTF5Fvmcn6an_Bg3VeAqneQa0";
const MODEL = "gemini-2.5-flash-image"; // Based on earlier observation
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const contentDir = path.join(process.cwd(), "content");
const basePath = path.join(process.cwd(), "public", "images", "ogp");

async function generateImage(prompt, filename, retries = 5) {
  const filepath = path.join(basePath, filename);

  if (fs.existsSync(filepath)) {
     console.log(`[${filename}] already exists, skipping generation.`);
     return true;
  }

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`[${filename}] attempt ${attempt}/${retries}...`);
    try {
      const resp = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (resp.status === 429) {
        console.log(`  Rate limited (429). Waiting 45s...`);
        await new Promise((r) => setTimeout(r, 45000));
        continue;
      }

      if (!resp.ok) {
        const errText = await resp.text();
        console.log(`  ERROR ${resp.status}: ${errText.slice(0, 200)}`);
        continue;
      }

      const result = await resp.json();
      let saved = false;
      for (const candidate of result.candidates || []) {
        for (const part of candidate.content?.parts || []) {
          if (part.inlineData) {
            const buf = Buffer.from(part.inlineData.data, "base64");
            fs.writeFileSync(filepath, buf);
            console.log(`  OK: ${filepath} (${buf.length} bytes)`);
            saved = true;
            break;
          }
        }
        if(saved) break;
      }
      
      if (saved) return true;
      console.log(`  No image in response, retrying...`);
    } catch (e) {
      console.log(`  ERROR: ${e.message}`);
    }

    await new Promise((r) => setTimeout(r, 5000));
  }

  console.log(`  FAILED: ${filename}`);
  return false;
}

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

async function main() {
  fs.mkdirSync(basePath, { recursive: true });

  const mdFiles = getMdFiles(contentDir);
  console.log(`Found ${mdFiles.length} markdown files.`);

  for (const file of mdFiles) {
    const content = fs.readFileSync(file, "utf8");
    const parsed = matter(content);
    
    const title = parsed.data.title || "";
    const description = parsed.data.description || "";
    const basename = path.parse(file).name;
    const filename = `${basename}.png`;
    
    // Photo-style prompt
    const prompt = `Create a high quality, realistic cinematic photograph for a business article. 
Context: Japanese business corporate environment, career advancement, job transition.
Article Title: "${title}"
Article Description: "${description}"
Requirements: 
- Very realistic photo style, not an illustration.
- Clean, corporate, aspirational mood.
- Shot with a 35mm lens, depth of field, natural lighting.
- NO text, NO watermarks, NO icons.
- Must feel authentic to a modern Japanese office or business setting.`;

    const success = await generateImage(prompt, filename);
    if (success) {
      const imagePath = `/images/ogp/${filename}`;
      if (parsed.data.image !== imagePath) {
        parsed.data.image = imagePath;
        const newContent = matter.stringify(parsed.content, parsed.data);
        fs.writeFileSync(file, newContent, "utf8");
        console.log(`  Updated frontmatter for ${file}`);
      }
    }
    
    // Wait between requests to ease the API limit
    await new Promise(r => setTimeout(r, 8000));
  }
  console.log("Done!");
}

main();
