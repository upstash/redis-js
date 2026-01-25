import type { CommandOptions } from "./command";
import { Command } from "./command";

type XAckDelOption = "KEEPREF" | "keepref" | "DELREF" | "delref" | "ACKED" | "acked";

/**
 * @see https://redis.io/commands/xackdel
 */
export class XAckDelCommand extends Command<number[], number[]> {
  constructor(
    [key, group, opts, ...ids]: [
      key: string,
      group: string,
      opts?: XAckDelOption,
      ...ids: string[],
    ],
    cmdOpts?: CommandOptions<number[], number[]>
  ) {
    const command: unknown[] = ["XACKDEL", key, group];

    if (opts) {
      command.push(opts.toUpperCase());
    }

    command.push("IDS", ids.length, ...ids);

    super(command, cmdOpts);
  }
}
