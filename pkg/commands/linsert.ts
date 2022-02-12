import { Command } from "../command"
export class LInsertCommand<TValue = string> extends Command<number> {
  constructor(key: string, direction: "before" | "after", pivot: TValue, value: TValue) {
    super(["linsert", key, direction, pivot, value])
  }
}
