import { deserializeScanResponse } from "../util";
import { Command, CommandOptions } from "./command";

export type ScanCommandOptions = {
  match?: string;
  count?: number;
  type?: string;
};
/**
 * @see https://redis.io/commands/scan
 */
export class ScanCommand extends Command<[string, string[]], [string, string[]]> {
  constructor(
    [cursor, opts]: [cursor: string | number, opts?: ScanCommandOptions],
    cmdOpts?: CommandOptions<[string, string[]], [string, string[]]>
  ) {
    const command: (number | string)[] = ["scan", cursor];
    if (opts?.match) {
      command.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command.push("count", opts.count);
    }
    if (opts?.type && opts.type.length > 0) {
      command.push("type", opts.type);
    }
    super(command, {
      deserialize: deserializeScanResponse,
      ...cmdOpts,
    });
  }
}
