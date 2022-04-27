import { Command } from "./command.ts";
export class LRemCommand<TData> extends Command<number, number> {
  constructor(key: string, count: number, value: TData) {
    super(["lrem", key, count, value]);
  }
}
