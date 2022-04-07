import { Command } from "./command"

export class LRangeCommand<TData = string> extends Command<TData[], unknown[]> {
  constructor(cmd: [key: string, start: number, end: number]) {
    super(["lrange", ...cmd])
  }
}
