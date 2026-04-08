import fs from "fs";
import path from "path";

const API_KEY = "AIzaSyCbizOk97rTF5Fvmcn6an_Bg3VeAqneQa0";
const MODEL = "gemini-2.5-flash-image";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const dest = "c:\\Users\\naoki\\AIエージェント用\\副業検討\\site\\public\\images\\ogp\\jtc-complete-guide.png";

async function main() {
  const prompt = `Create a high quality, realistic cinematic photograph for a business article. 
Context: Japanese business corporate environment, career advancement, job transition.
Article Title: "【完全ガイド】JTC転職の教科書——ベンチャーから大手に年収3.5倍で移った全手順"
Requirements: 
- Very realistic photo style, not an illustration.
- Clean, corporate, aspirational mood.
- Shot with a 35mm lens, depth of field, natural lighting.
- CRITICAL INSTRUCTION: Absolutely NO text, letters, words, signboards, or characters anywhere in the image. Do NOT include any Japanese text like "大手企業本社". Keep the background clean architectural elements, sky, or elegantly blurred out.`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  };

  while (true) {
    const resp = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (resp.status === 429) {
      console.log("Rate limited. Waiting 15s...");
      await new Promise(r => setTimeout(r, 15000));
      continue;
    }
    
    if (!resp.ok) {
        console.log("Failed " + resp.status + " " + await resp.text());
        return;
    }
    
    const result = await resp.json();
    for (const candidate of result.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) {
          const buf = Buffer.from(part.inlineData.data, "base64");
          fs.writeFileSync(dest, buf);
          console.log(`Saved ${dest} (${buf.length} bytes)`);
          return;
        }
      }
    }
    
    console.log("No image returned, retrying...");
    await new Promise(r => setTimeout(r, 5000));
  }
}
main();
