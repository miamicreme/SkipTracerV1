// src/utils/queue.js
import pLimit from 'p-limit';

const DEFAULT_CONCURRENCY = 5;
const concurrency = parseInt(process.env.QUEUE_CONCURRENCY ?? DEFAULT_CONCURRENCY, 10);

export function createQueue() {
  const limit = pLimit(concurrency);
  const tasks = [];

  return {
    push(fn) {
      tasks.push(limit(fn));
    },
    async runAll() {
      return Promise.all(tasks);
    },
  };
}
