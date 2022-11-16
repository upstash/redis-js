import { Redis } from "./mod.ts";

for (let i = 0; i < 10; i++) {
  const redis = new Redis({
    url: "https://us1-blessed-hornet-39114.upstash.io",
    token:
      "AZjKASQgMmRjZGEwYmYtMzI0Mi00YjBkLTlkZjktYTdmYjQyN2RiMTg4Nzk1YjUxMTg2NGJhNDk2OWJiNTcwNmY1MWI0YmM2MTE=",
  });

  const start = Date.now();
  await redis.hget("hash", "key");
  const latency = Date.now() - start;

  console.log({ latency });
}
