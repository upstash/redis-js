import type { CommandOptions } from "./command";
import { Command } from "./command";

export class LSetCommand<TData = string> extends Command<"OK", "OK"> {
  constructor(cmd: [key: string, index: number, data: TData], opts?: CommandOptions<"OK", "OK">) {
    super(["lset", ...cmd], opts);
  }
}
