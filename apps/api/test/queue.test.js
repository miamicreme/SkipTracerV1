import { describe, it, expect, vi, afterEach } from 'vitest';
import { setTimeout } from 'timers/promises';

async function loadQueue(concurrency) {
  process.env.QUEUE_CONCURRENCY = String(concurrency);
  vi.resetModules();
  return (await import('../src/services/queue.js')).createQueue;
}

describe('createQueue', () => {
  afterEach(() => {
    delete process.env.QUEUE_CONCURRENCY;
    vi.resetModules();
  });

  it('runs tasks sequentially when concurrency is 1', async () => {
    const createQueue = await loadQueue(1);
    const order = [];
    const q = createQueue();
    q.push(async () => { order.push('a'); await setTimeout(10); return 'x'; });
    q.push(async () => { order.push('b'); return 'y'; });
    const results = await q.runAll();
    expect(results).toEqual(['x','y']);
    expect(order).toEqual(['a','b']);
  });
});
