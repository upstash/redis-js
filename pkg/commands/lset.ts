import { Command, CommandOptions } from "./command.ts";

export class LSetCommand<TData = string> extends Command<"OK", "OK"> {
  constructor(
    cmd: [key: string, index: number, data: TData],
    opts?: CommandOptions<"OK", "OK">,
  ) {
    super(["lset", ...cmd], opts);
  }
}
