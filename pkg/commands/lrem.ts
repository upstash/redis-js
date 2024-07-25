import type { CommandOptions } from "./command";
import { Command } from "./command";
export class LRemCommand<TData> extends Command<number, number> {
  constructor(
    cmd: [key: string, count: number, value: TData],
    opts?: CommandOptions<number, number>
  ) {
    super(["lrem", ...cmd], opts);
  }
}
