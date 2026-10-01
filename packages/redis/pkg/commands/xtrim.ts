import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/xtrim
 * @see node_modules/@upstash/redis/docs/commands/stream/xtrim.mdx
 */

type XTrimOptions = {
  strategy: "MAXLEN" | "MINID";
  exactness?: "~" | "=";
  threshold: number | string;
  limit?: number;
};

export class XTrimCommand extends Command<number, number> {
  constructor(
    [key, options]: [key: string, options: XTrimOptions],
    opts?: CommandOptions<number, number>
  ) {
    const { limit, strategy, threshold, exactness = "~" } = options;

    super(["XTRIM", key, strategy, exactness, threshold, ...(limit ? ["LIMIT", limit] : [])], opts);
  }
}
