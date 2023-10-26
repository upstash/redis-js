import { Command, CommandOptions } from "./command";

export class LTrimCommand extends Command<"OK", "OK"> {
  constructor(cmd: [key: string, start: number, end: number], opts?: CommandOptions<"OK", "OK">) {
    super(["ltrim", ...cmd], opts);
  }
}
