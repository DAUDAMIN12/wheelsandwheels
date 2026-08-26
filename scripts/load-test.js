const target = process.argv[2] || "http://127.0.0.1:5000/api/products";
const concurrency = Number(process.argv[3] || 500);
const durationMs = Number(process.argv[4] || 15000);
const deadline = Date.now() + durationMs;
const times = [];
let completed = 0;
let failed = 0;
let statusErrors = 0;

async function client() {
  while (Date.now() < deadline) {
    const started = performance.now();
    try {
      const response = await fetch(target);
      await response.arrayBuffer();
      if (!response.ok) statusErrors += 1;
      else completed += 1;
    } catch {
      failed += 1;
    } finally {
      times.push(performance.now() - started);
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, client));
times.sort((a, b) => a - b);
const percentile = (value) =>
  times[Math.min(times.length - 1, Math.floor(times.length * value))] || 0;
const seconds = durationMs / 1000;
console.log(
  JSON.stringify(
    {
      target,
      concurrency,
      durationSeconds: seconds,
      completed,
      failed,
      statusErrors,
      requestsPerSecond: Number((completed / seconds).toFixed(1)),
      latencyMs: {
        average: Number(
          (
            times.reduce((sum, time) => sum + time, 0) /
            Math.max(1, times.length)
          ).toFixed(1),
        ),
        p50: Number(percentile(0.5).toFixed(1)),
        p95: Number(percentile(0.95).toFixed(1)),
        p99: Number(percentile(0.99).toFixed(1)),
        maximum: Number((times.at(-1) || 0).toFixed(1)),
      },
    },
    null,
    2,
  ),
);
