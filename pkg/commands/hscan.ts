import { ScanCommandOptions } from "./scan.ts";
import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/hscan
 */
export class HScanCommand extends Command<
  [number, (string | number)[]],
  [number, (string | number)[]]
> {
  constructor(
    [key, cursor, cmdOpts]: [
      key: string,
      cursor: number,
      cmdOpts?: ScanCommandOptions,
    ],
    opts?: CommandOptions<
      [number, (string | number)[]],
      [number, (string | number)[]]
    >,
  ) {
    const command = ["hscan", key, cursor];
    if (cmdOpts?.match) {
      command.push("match", cmdOpts.match);
    }
    if (typeof cmdOpts?.count === "number") {
      command.push("count", cmdOpts.count);
    }

    super(command, opts);
  }
}
