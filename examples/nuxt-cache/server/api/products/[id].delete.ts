export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const id = getRouterParam(event, "id")!;
  await useStorage("cache").removeItem(`nitro:functions:product:${id}.json`);
  return { invalidated: id };
});
