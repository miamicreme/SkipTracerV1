export function log(...args) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(new Date().toISOString(), ...args);
  }
}
