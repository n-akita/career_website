import fs from "fs";
import path from "path";

const API_KEY = "AIzaSyCbizOk97rTF5Fvmcn6an_Bg3VeAqneQa0";
const MODEL = "gemini-2.5-flash-image";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const basePath = "public/images";

const images = [
  {
    prompt:
      "Create a clean, modern illustration for a business article about DX talent salary. A professional Japanese businessman looking at a rising salary chart/graph with digital transformation icons (AI, cloud, data). Blue and white tones, minimalist flat design, wide aspect ratio 16:9. No text in the image.",
    filename: "dx_talent_salary.png",
  },
  {
    prompt:
      "Create a clean, modern illustration for a business article about career comeback. A Japanese businessman going from a dark shadow/failure scene on the left to a bright confident scene on the right, showing transformation. Blue tones, minimalist flat design, wide aspect ratio 16:9. No text in the image.",
    filename: "from_zero_to_hero.png",
  },
  {
    prompt:
      "Create a clean, modern illustration for a business article about choosing venture startup after graduating from elite university. A young Japanese man at a fork in the road - one path to a large corporate building, another to a small energetic startup office. Blue and warm tones, minimalist flat design, wide aspect ratio 16:9. No text in the image.",
    filename: "keio_to_venture.png",
  },
  {
    prompt:
      "Create a clean, modern illustration for a business article about a cancelled large-scale projection mapping event due to COVID. A lone figure standing in front of a large dark building/screen at night, with faint projection lights fading away. Melancholic but beautiful atmosphere, blue and purple tones, minimalist style, wide aspect ratio 16:9. No text in the image.",
    filename: "projection_mapping_night.png",
  },
  {
    prompt:
      "Create a clean, modern illustration for a business article about high-class job change for salary over 10 million yen. A confident professional ascending stairs made of coins/money toward a premium office door with a golden glow. Blue and gold tones, minimalist flat design, wide aspect ratio 16:9. No text in the image.",
    filename: "high_salary_job_change.png",
  },
  {
    prompt:
      "Create a clean, modern illustration for a business article about how many times you can change jobs. Multiple doors in a row, each slightly different, with a businessman walking through them sequentially. Shows progression and growth. Blue tones, minimalist flat design, wide aspect ratio 16:9. No text in the image.",
    filename: "job_change_count.png",
  },
  {
    prompt:
      "Create a clean, modern illustration for a business article about career change after age 35. A mature Japanese businessman standing at a crossroads, looking determined and confident, with a city skyline in the background. Warm blue and orange sunset tones, minimalist flat design, wide aspect ratio 16:9. No text in the image.",
    filename: "over_35_career.png",
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
        console.log(`  ERROR ${resp.status}: ${errText.slice(0, 300)}`);
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
