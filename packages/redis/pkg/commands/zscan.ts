import { deserializeScanResponse } from "../util";
import type { CommandOptions } from "./command";
import { Command } from "./command";
import type { ScanCommandOptions } from "./scan";

/**
 * @see https://redis.io/commands/zscan
 */
export class ZScanCommand extends Command<
  [string, (string | number)[]],
  [string, (string | number)[]]
> {
  constructor(
    [key, cursor, opts]: [key: string, cursor: string | number, opts?: ScanCommandOptions],
    cmdOpts?: CommandOptions<[string, (string | number)[]], [string, (string | number)[]]>
  ) {
    const command: (number | string)[] = ["zscan", key, cursor];
    if (opts?.match) {
      command.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command.push("count", opts.count);
    }

    super(command, {
      deserialize: deserializeScanResponse,
      ...cmdOpts,
    });
  }
}
