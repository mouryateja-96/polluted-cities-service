const cache = {};

export function memoCache(key, ttl, fn) {
  return async (...args) => {
    const now = Date.now();
    if (cache[key] && (now - cache[key].ts < ttl)) {
      return cache[key].value;
    }
    const value = await fn(...args);
    cache[key] = { value, ts: now };
    return value;
  };
}
