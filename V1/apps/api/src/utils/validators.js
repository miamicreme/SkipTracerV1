export function validateJobInput(input) {
  if (!input || typeof input !== 'object') throw new Error('Invalid JSON body');
  if (!input.phones && !input.addresses && !input.names) {
    throw new Error('At least one of phones, addresses, names is required');
  }
  return input;
}
