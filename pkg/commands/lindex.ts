import { Command } from "../command"

export class LIndexCommand<TValue = string> extends Command<TValue | null> {
  constructor(key: string, index: number) {
    super(["lindex", key, index])
  }
}
