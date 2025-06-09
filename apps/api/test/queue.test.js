import { describe, it, expect, beforeEach } from 'vitest';

let createQueue;

describe('createQueue', () => {
  beforeEach(async () => {
    process.env.QUEUE_CONCURRENCY = '2';
    // Re-import module to pick up env var
    ({ createQueue } = await import('../src/services/queue.js'));
  });

  it('runs pushed tasks and returns their results', async () => {
    const q = createQueue();
    q.push(async () => 1);
    q.push(async () => 2);
    const results = await q.runAll();
    expect(results).toEqual([1, 2]);
  });
});
