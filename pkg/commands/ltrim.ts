import { Command } from "./command";

export class LTrimCommand extends Command<"OK", "OK"> {
  constructor(cmd: [key: string, start: number, end: number]) {
    super(["ltrim", ...cmd])
  }
}
