export async function handleRequest(request: Request): Promise<Response> {
  return new Response(JSON.stringify({ count: 2 }));
}
