import { ScanCommandOptions } from "./scan";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hscan
 */
export class HScanCommand extends Command<
  [number, (string | number)[]],
  [number, (string | number)[]]
> {
  constructor(key: string, cursor: number, opts?: ScanCommandOptions) {
    const command = ["hscan", key, cursor];
    if (opts?.match) {
      command.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command.push("count", opts.count);
    }

    super(command);
  }
}
