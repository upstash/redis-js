import { Command } from "../command"
export class LRemCommand extends Command<number> {
  constructor(key: string, count: number, value: string) {
    super(["lrem", key, count, value])
  }
}
