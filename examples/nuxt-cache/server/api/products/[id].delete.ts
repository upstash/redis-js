export default defineEventHandler(async (event) => {
  // Protect this route (auth, admin token, ...) in a real app
  const id = getRouterParam(event, "id")!;
  await useStorage("cache").removeItem(`nitro:functions:product:${id}.json`);
  return { invalidated: id };
});
