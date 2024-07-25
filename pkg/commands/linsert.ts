import type { CommandOptions } from "./command";
import { Command } from "./command";
export class LInsertCommand<TData = string> extends Command<number, number> {
  constructor(
    cmd: [key: string, direction: "before" | "after", pivot: TData, value: TData],
    opts?: CommandOptions<number, number>
  ) {
    super(["linsert", ...cmd], opts);
  }
}
