export default defineCachedEventHandler(
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { visitors: 1234, computedAt: new Date().toISOString(), computedBy: process.pid };
  },
  {
    name: "stats",
    maxAge: 30,
    swr: true,
  }
);
