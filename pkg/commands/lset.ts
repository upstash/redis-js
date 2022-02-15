import { Command } from "../command"

export class LSetCommand<TData = string> extends Command<"OK"> {
  constructor(key: string, value: TData, index: number) {
    super(["lset", key, index, value])
  }
}
