export async function fetchWithConcurrency(urls, maxConcurrency) {
  const results = [];
  let index = 0;

  const next = async () => {
    if (index >= urls.length) return;
    const currentIndex = index++;
    try {
      const res = await fetch(urls[currentIndex]);
      results[currentIndex] = await res.text();
    } catch (err) {
      results[currentIndex] = `Error: ${err.message}`;
    }
    await next();
  };

  const workers = [];
  for (let i = 0; i < Math.min(maxConcurrency, urls.length); i++) {
    workers.push(next());
  }

  await Promise.all(workers);
  return results;
}
