import { Command, CommandOptions } from "./command";

type ExpireOptions = "NX" | "nx" | "XX" | "xx" | "GT" | "gt" | "LT" | "lt";
export class ExpireCommand extends Command<"0" | "1", 0 | 1> {
  constructor(
    cmd: [key: string, seconds: number, option?: ExpireOptions],
    opts?: CommandOptions<"0" | "1", 0 | 1>,
  ) {
    super(["expire", ...cmd], opts);
  }
}
