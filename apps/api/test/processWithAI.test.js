import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';

vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: { completions: { create: vi.fn(async () => ({
        choices: [{ message: { content: '[{"parser":"p","data":{},"score":1}]' } }]
      })) } }
    }))
  };
});

import { organizeAndRate } from '../src/processWithAI.js';

describe('organizeAndRate', () => {
  const rawFile = path.join(tmpdir(), 'raw.json');
  const outFile = path.join(tmpdir(), 'ranked.json');

  beforeEach(async () => {
    await fs.writeFile(rawFile, JSON.stringify([{ parser: 'test' }]), 'utf8');
  });

  afterEach(async () => {
    vi.resetAllMocks();
  });

  it('writes AI organized results to file', async () => {
    const returned = await organizeAndRate(rawFile, outFile);
    expect(returned).toBe(outFile);
    const text = await fs.readFile(outFile, 'utf8');
    expect(text).toContain('parser');
  });
});
