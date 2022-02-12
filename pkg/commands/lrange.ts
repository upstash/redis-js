import { Command } from "../command"

export class LRangeCommand<TValue = string> extends Command<TValue[]> {
  constructor(key: string, start: number, end: number) {
    super(["lrange", key, start, end])
  }
}
