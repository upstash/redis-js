import { Command, CommandOptions } from "./command";

export class LIndexCommand<TData = string> extends Command<unknown | null, TData | null> {
  constructor(
    cmd: [key: string, index: number],
    opts?: CommandOptions<unknown | null, TData | null>,
  ) {
    super(["lindex", ...cmd], opts);
  }
}
