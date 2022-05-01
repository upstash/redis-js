import { Command, CommandOptions } from "./command.ts";

export class LRangeCommand<TData = string> extends Command<unknown[], TData[]> {
  constructor(
    cmd: [key: string, start: number, end: number],
    opts?: CommandOptions<unknown[], TData[]>,
  ) {
    super(["lrange", ...cmd], opts);
  }
}
