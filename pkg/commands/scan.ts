import { Command, CommandOptions } from "./command.ts";

export type ScanCommandOptions = { match?: string; count?: number };
/**
 * @see https://redis.io/commands/scan
 */
export class ScanCommand extends Command<
  [number, string[]],
  [number, string[]]
> {
  constructor(
    [cursor, opts]: [cursor: number, opts?: ScanCommandOptions],
    cmdOpts?: CommandOptions<[number, string[]], [number, string[]]>,
  ) {
    const command = ["scan", cursor];
    if (opts?.match) {
      command.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command.push("count", opts.count);
    }
    super(command, cmdOpts);
  }
}
