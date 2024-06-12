import { deserializeScanResponse } from "../util";
import { Command, CommandOptions } from "./command";
import { ScanCommandOptions } from "./scan";

/**
 * @see https://redis.io/commands/hscan
 */
export class HScanCommand extends Command<
  [string, (string | number)[]],
  [string, (string | number)[]]
> {
  constructor(
    [key, cursor, cmdOpts]: [key: string, cursor: string | number, cmdOpts?: ScanCommandOptions],
    opts?: CommandOptions<[string, (string | number)[]], [string, (string | number)[]]>,
  ) {
    const command: (number | string)[] = ["hscan", key, cursor];
    if (cmdOpts?.match) {
      command.push("match", cmdOpts.match);
    }
    if (typeof cmdOpts?.count === "number") {
      command.push("count", cmdOpts.count);
    }

    super(command, {
      deserialize: deserializeScanResponse,
      ...opts,
    });
  }
}
