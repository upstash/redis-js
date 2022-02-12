import { Command } from "../command"

export class LSetCommand<TValue = string> extends Command<"OK"> {
  constructor(key: string, value: TValue, index: number) {
    super(["lset", key, index, value])
  }
}
