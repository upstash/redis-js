export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id")!;
  // Only cache ids that can exist, so random ids can't fill Redis
  if (!/^\d+$/.test(id)) throw createError({ statusCode: 400, statusMessage: "Invalid id" });
  return getProduct(id);
});
