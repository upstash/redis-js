import type { CommandOptions } from "./command";
import { Command } from "./command";

type XDelExOption = "KEEPREF" | "keepref" | "DELREF" | "delref" | "ACKED" | "acked";

/**
 * @see https://redis.io/commands/xdelex
 */
export class XDelExCommand extends Command<number[], number[]> {
  constructor(
    [key, opts, ...ids]: [key: string, opts?: XDelExOption, ...ids: string[]],
    cmdOpts?: CommandOptions<number[], number[]>
  ) {
    const command: unknown[] = ["XDELEX", key];

    if (opts) {
      command.push(opts.toUpperCase());
    }

    command.push("IDS", ids.length, ...ids);

    super(command, cmdOpts);
  }
}
