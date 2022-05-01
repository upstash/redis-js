import { Command, CommandOptions } from "./command.ts";
export class LRemCommand<TData> extends Command<number, number> {
  constructor(
    cmd: [key: string, count: number, value: TData],
    opts?: CommandOptions<number, number>,
  ) {
    super(["lrem", ...cmd], opts);
  }
}
