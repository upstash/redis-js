import { Command } from "./command";

export type ScanCommandOptions = { match?: string; count?: number };
/**
 * @see https://redis.io/commands/scan
 */
export class ScanCommand
  extends Command<[number, string[]], [number, string[]]> {
  constructor(cursor: number, opts?: ScanCommandOptions) {
    const command = ["scan", cursor];
    if (opts?.match) {
      command.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command.push("count", opts.count);
    }
    super(command);
  }
}
