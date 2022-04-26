import { Command } from "./command";

export class LIndexCommand<TData = string> extends Command<
  TData | null,
  unknown | null
> {
  constructor(key: string, index: number) {
    super(["lindex", key, index]);
  }
}
