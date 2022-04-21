import { Command } from "./command";

export class LIndexCommand<TData = string> extends Command<TData | null, unknown | null> {
  constructor(cmd: [key: string, index: number]) {
    super(["lindex", ...cmd])
  }
}
