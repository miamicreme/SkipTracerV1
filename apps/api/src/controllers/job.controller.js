import { aggregate } from '../runAllParsers.js';
import { organizeAndRate } from '../processWithAI.js';
export async function runJob(req, res) {
  try {
    const { mode, query } = req.body;
    const rawFile = await aggregate(mode, query, 'tmp-raw.json');
    const rankedFile = await organizeAndRate(rawFile, 'tmp-ranked.json');
    res.status(200).download(rankedFile);
  } catch (error) {
    console.error('Job Controller Error:', error);
    res.status(500).json({ error: error.message });
  }
}