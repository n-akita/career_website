import fs from "fs";

const API_KEY = "AIzaSyCbizOk97rTF5Fvmcn6an_Bg3VeAqneQa0";
const MODEL = "gemini-2.5-flash-image"; // Or maybe gemini-imagen?
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function test() {
  const payload = {
    contents: [{ parts: [{ text: "test" }] }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  };
  const resp = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  console.log(resp.status);
  console.log(await resp.text());
}
test();
