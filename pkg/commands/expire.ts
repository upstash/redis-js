import type { CommandOptions } from "./command";
import { Command } from "./command";

export type ExpireOption = "NX" | "nx" | "XX" | "xx" | "GT" | "gt" | "LT" | "lt";

export class ExpireCommand extends Command<"0" | "1", 0 | 1> {
  constructor(
    cmd: [key: string, seconds: number, option?: ExpireOption],
    opts?: CommandOptions<"0" | "1", 0 | 1>
  ) {
    super(["expire", ...cmd.filter(Boolean)], opts);
  }
}
