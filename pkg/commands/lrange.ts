import { Command } from "./command";

export class LRangeCommand<TData = string> extends Command<TData[], unknown[]> {
  constructor(key: string, start: number, end: number) {
    super(["lrange", key, start, end]);
  }
}
