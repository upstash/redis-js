import { Command } from "./command.ts";

export class LTrimCommand extends Command<"OK", "OK"> {
  constructor(key: string, start: number, end: number) {
    super(["ltrim", key, start, end]);
  }
}
