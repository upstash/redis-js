import type { CommandOptions } from "./command";
import { Command } from "./command";

export class HExpireTimeCommand extends Command<number[], number[]> {
  constructor(
    cmd: [key: string, fields: (string | number) | (string | number)[]],
    opts?: CommandOptions<number[], number[]>
  ) {
    const [key, fields] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["hexpiretime", key, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
}
