import { Command } from "./command.ts";
export class LInsertCommand<TData = string> extends Command<number, number> {
  constructor(
    key: string,
    direction: "before" | "after",
    pivot: TData,
    value: TData,
  ) {
    super(["linsert", key, direction, pivot, value]);
  }
}
