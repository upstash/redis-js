import { Command, CommandOptions } from "./command";

type XInfoCommands =
  | {
      type: "CONSUMERS";
      group: string;
    }
  | { type: "GROUPS" };

/**
 * @see https://redis.io/commands/xinfo
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
