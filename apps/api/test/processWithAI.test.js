import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

vi.mock('openai', () => {
  return {
    default: class {
      chat = { completions: { create: vi.fn().mockResolvedValue({
        choices: [{ message: { content: 'AIRESULT' } }]
      }) } };
    }
  };
});

import { organizeAndRate } from '../src/processWithAI.js';

describe('organizeAndRate', () => {
  let tmpDir;
  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ai-'));
  });
  afterEach(async () => {
    vi.restoreAllMocks();
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('writes AI-organized results to file', async () => {
    const rawPath = path.join(tmpDir, 'raw.json');
    const outPath = path.join(tmpDir, 'out.json');
    await fs.writeFile(rawPath, JSON.stringify([{ parser: 'p', data: {} }]), 'utf-8');
    const full = await organizeAndRate(rawPath, outPath);
    expect(full).toBe(path.resolve(process.cwd(), outPath));
    const txt = await fs.readFile(full, 'utf-8');
    expect(txt).toBe('AIRESULT');
  });
});
