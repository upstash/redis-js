import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/lmpop
 */
export class LmPopCommand<TValues> extends Command<
  [string, TValues[]] | null,
  [string, TValues[]] | null
> {
  constructor(
    cmd: [numkeys: number, keys: string[], "LEFT" | "RIGHT", count?: number],
    opts?: CommandOptions<[string, TValues[]] | null, [string, TValues[]] | null>
  ) {
    const [numkeys, keys, direction, count] = cmd;

    super(["LMPOP", numkeys, ...keys, direction, ...(count ? ["COUNT", count] : [])], opts);
  }
}
