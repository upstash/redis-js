import { ScanCommandOptions } from "./scan.ts";
import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/sscan
 */
export class SScanCommand extends Command<
  [number, (string | number)[]],
  [number, (string | number)[]]
> {
  constructor(
    [key, cursor, opts]: [
      key: string,
      cursor: number,
      opts?: ScanCommandOptions,
    ],
    cmdOpts?: CommandOptions<
      [number, (string | number)[]],
      [number, (string | number)[]]
    >,
  ) {
    const command = ["sscan", key, cursor];
    if (opts?.match) {
      command.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command.push("count", opts.count);
    }

    super(command, cmdOpts);
  }
}
