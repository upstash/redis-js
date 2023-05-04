import { Redis } from "../../../../mod.js";

const redis = Redis.fromEnv();
export default async (_req: Request) => {
  console.log("Hello");
  try {
    return new Response(JSON.stringify({
      message: "Hello World",
      counter: await redis.incr("netlify-edge"),
    }));
  } catch (err) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
};

export const config = { path: "/incr" };
