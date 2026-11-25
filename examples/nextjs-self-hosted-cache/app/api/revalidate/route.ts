import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  // Only callers with the admin token may expire the cache
  const token = process.env.CACHE_ADMIN_TOKEN;
  if (!token || request.headers.get("authorization") !== `Bearer ${token}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  revalidateTag("posts", { expire: 0 });
  return Response.json({ revalidated: true });
}
