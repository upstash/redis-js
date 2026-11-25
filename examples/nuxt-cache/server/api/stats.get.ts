export default defineCachedEventHandler(
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { visitors: 1234, computedAt: new Date().toISOString(), computedBy: process.pid };
  },
  {
    name: "stats",
    // One key for everyone: the response doesn't depend on the query string
    getKey: () => "all",
    maxAge: 30,
    swr: true,
  }
);
