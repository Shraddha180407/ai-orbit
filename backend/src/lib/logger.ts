/* Minimal logger abstraction.
   Wraps console so the codebase can swap in a structured logger later
   without touching every callsite. */

function log(level: 'log' | 'info' | 'warn' | 'error', ...args: unknown[]) {
  // eslint-disable-next-line no-console
  console[level](...args);
}

export const logger = {
  info: (...args: unknown[]) => log('info', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args),
  debug: (...args: unknown[]) => log('log', ...args),
};
