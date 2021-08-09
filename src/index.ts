import Client from "./Client";
import { ClientOptions } from "./lib/types";

const createClient = (
  upstashUrl: string,
  upstashKey: string,
  options?: ClientOptions
) => {
  return new Client(upstashUrl, upstashKey, options);
};

export { createClient };
