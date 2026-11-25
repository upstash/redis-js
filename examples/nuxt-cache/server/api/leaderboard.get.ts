export default defineEventHandler(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { top: ["alice", "bob"], computedAt: new Date().toISOString(), computedBy: process.pid };
});
