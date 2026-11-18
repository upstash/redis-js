import { revalidateTag } from "next/cache";

export async function POST() {
  revalidateTag("posts", { expire: 0 });
  return Response.json({ revalidated: true });
}
