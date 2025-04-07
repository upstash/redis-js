import type { CommandOptions } from "./command";
import { Command } from "./command";

export class HPExpireAtCommand extends Command<(-2 | 0 | 1 | 2)[], (-2 | 0 | 1 | 2)[]> {
  constructor(
    cmd: [key: string, fields: (string | number) | (string | number)[], timestamp: number],
    opts?: CommandOptions<(-2 | 0 | 1 | 2)[], (-2 | 0 | 1 | 2)[]>
  ) {
    const [key, fields, timestamp] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["hpexpireat", key, timestamp, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
}
