import { Command } from "./command.ts";

export class LSetCommand<TData = string> extends Command<"OK", "OK"> {
  constructor(key: string, value: TData, index: number) {
    super(["lset", key, index, value]);
  }
}
