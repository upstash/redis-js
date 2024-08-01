import type { CommandOptions } from "./command";
import { Command } from "./command";

export class LRangeCommand<TData = string> extends Command<unknown[], TData[]> {
  constructor(
    cmd: [key: string, start: number, end: number],
    opts?: CommandOptions<unknown[], TData[]>
  ) {
    super(["lrange", ...cmd], opts);
  }
}
