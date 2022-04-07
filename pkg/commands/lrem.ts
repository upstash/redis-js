import { Command } from "./command"
export class LRemCommand<TData> extends Command<number, number> {
  constructor(cmd: [key: string, count: number, value: TData]) {
    super(["lrem", ...cmd])
  }
}
