import pLimit from 'p-limit';
import config from 'config';
const { concurrency } = config.get('queue');

export function createQueue() {
  const limit = pLimit(concurrency);
  const tasks = [];
  return {
    push(fn) {
      tasks.push(limit(fn));
    },
    async runAll() {
      return Promise.all(tasks);
    }
  };
}
