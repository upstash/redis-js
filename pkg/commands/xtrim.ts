import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/xtrim
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
    opts?: CommandOptions<number, number>,
  ) {
    const { limit, strategy, threshold, exactness = "~" } = options;

    super(["XTRIM", key, strategy, exactness, threshold, ...(limit ? ["LIMIT", limit] : [])], opts);
  }
}
