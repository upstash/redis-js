import { Command } from "./command"

export class LSetCommand<TData = string> extends Command<"OK", "OK"> {
  constructor(cmd: [key: string, index: number, data: TData]) {
    super(["lset", ...cmd])
  }
}
