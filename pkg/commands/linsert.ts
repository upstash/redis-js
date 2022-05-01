import { Command, CommandOptions } from "./command.ts";
export class LInsertCommand<TData = string> extends Command<number, number> {
  constructor(
    cmd: [
      key: string,
      direction: "before" | "after",
      pivot: TData,
      value: TData,
    ],
    opts?: CommandOptions<number, number>,
  ) {
    super(["linsert", ...cmd], opts);
  }
}
