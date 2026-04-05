import fs from "fs";
import path from "path";

const API_KEY = "AIzaSyCbizOk97rTF5Fvmcn6an_Bg3VeAqneQa0";
const MODEL = "gemini-2.5-flash-image";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const basePath = "public/images";

const images = [
  {
    prompt:
      "Create a modern, clean illustration for a business career website hero image. A confident Japanese businessman standing at a crossroads with two paths - one leading to a tall corporate building, another to a startup. Blue gradient sky, minimalist flat design style, professional and aspirational mood. No text in the image.",
    filename: "hero.png",
  },
  {
    prompt:
      "Create a clean minimalist illustration icon for career thinking category. A lightbulb combined with a business briefcase, blue and white color scheme, flat design, suitable for web card thumbnail. No text, simple background.",
    filename: "career.png",
  },
  {
    prompt:
      "Create a clean minimalist illustration icon for job change know-how category. A rocket launching upward with a resume document, green and white color scheme, flat design, suitable for web card thumbnail. No text, simple background.",
    filename: "tenshoku.png",
  },
  {
    prompt:
      "Create a clean minimalist illustration icon for starting a side business category. A laptop with coins and a growing plant, amber gold and white color scheme, flat design, suitable for web card thumbnail. No text, simple background.",
    filename: "sidejob.png",
  },
  {
    prompt:
      "Create a friendly comic-style avatar icon of a male Japanese business professional blogger. Simple approachable illustration style like a social media profile picture. Blue suit, friendly smile, clean white background. No text.",
    filename: "avatar.png",
  },
];

async function generateImage(prompt, filename, retries = 5) {
  const filepath = path.join(basePath, filename);

  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`[${filename}] attempt ${attempt}/${retries}...`);

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    };

    try {
      const resp = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (resp.status === 429) {
        const wait = attempt * 15;
        console.log(`  Rate limited. Waiting ${wait}s...`);
        await new Promise((r) => setTimeout(r, wait * 1000));
        continue;
      }

      if (!resp.ok) {
        const errText = await resp.text();
        console.log(`  ERROR ${resp.status}: ${errText.slice(0, 200)}`);
        continue;
      }

      const result = await resp.json();

      for (const candidate of result.candidates || []) {
        for (const part of candidate.content?.parts || []) {
          if (part.inlineData) {
            const buf = Buffer.from(part.inlineData.data, "base64");
            fs.writeFileSync(filepath, buf);
            console.log(`  OK: ${filepath} (${buf.length} bytes)`);
            return true;
          }
        }
      }

      console.log(`  No image in response, retrying...`);
    } catch (e) {
      console.log(`  ERROR: ${e.message}`);
    }

    await new Promise((r) => setTimeout(r, 5000));
  }

  console.log(`  FAILED: ${filename}`);
  return false;
}

async function main() {
  fs.mkdirSync(basePath, { recursive: true });

  for (const { prompt, filename } of images) {
    await generateImage(prompt, filename);
    await new Promise((r) => setTimeout(r, 5000));
  }

  console.log("\nDone!");
}

main();
