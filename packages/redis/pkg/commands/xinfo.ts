import type { CommandOptions } from "./command";
import { Command } from "./command";

type XInfoCommands =
  | {
      type: "CONSUMERS";
      group: string;
    }
  | { type: "GROUPS" };

/**
 * @see https://redis.io/commands/xinfo
 * @see node_modules/@upstash/redis/docs/commands/stream/xinfo.mdx
 */
export class XInfoCommand extends Command<number, unknown[]> {
  constructor(
    [key, options]: [key: string, options: XInfoCommands],
    opts?: CommandOptions<number, unknown[]>
  ) {
    const cmds: unknown[] = [];
    if (options.type === "CONSUMERS") {
      cmds.push("CONSUMERS", key, options.group);
    } else {
      cmds.push("GROUPS", key);
    }
    super(["XINFO", ...cmds], opts);
  }
}
