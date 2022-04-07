import { Command } from "./command"
export class LInsertCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, direction: "before" | "after", pivot: TData, value: TData]) {
    super(["linsert", ...cmd])
  }
}
