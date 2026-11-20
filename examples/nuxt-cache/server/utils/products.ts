export const getProduct = defineCachedFunction(
  async (id: string) => {
    // Stand-in for a slow database query or third-party API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { id, name: `Product ${id}`, computedAt: new Date().toISOString(), computedBy: process.pid };
  },
  {
    name: "product",
    maxAge: 60,
    swr: false,
    getKey: (id: string) => id,
  }
);
