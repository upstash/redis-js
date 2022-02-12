import { Command } from "../command"

export class LTrimCommand extends Command<"OK"> {
  constructor(key: string, start: number, end: number) {
    super(["ltrim", key, start, end])
  }
}
