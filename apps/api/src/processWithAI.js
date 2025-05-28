import fs from 'fs/promises';
import OpenAI from 'openai';
import path from 'path';
import 'dotenv/config';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Organize raw parser results with AI and output ranked JSON.
 * @param {string} rawFile - input raw JSON file
 * @param {string} outFile - output AI-organized file
 */
export async function organizeAndRate(rawFile = 'raw-results.json', outFile = 'ranked-results.json') {
  const rawJson = JSON.parse(await fs.readFile(rawFile, 'utf-8'));
  const prompt = `
You are a data aggregator. Given this raw parser output array:

${JSON.stringify(rawJson, null, 2)}

1. Deduplicate duplicates.
2. Score each entry between 0.0 and 1.0 for confidence.
3. Output ONLY a JSON array of objects:
[
  {
    "parser": "...",
    "data": { ... },
    "score": 0.85
  },
  ...
]
`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: prompt }],
    temperature: 0
  });
  const text = response.choices[0].message.content;
  const fullPath = path.resolve(process.cwd(), outFile);
  await fs.writeFile(fullPath, text, 'utf-8');
  console.log(`Wrote organized results to ${fullPath}`);
  return fullPath;
}