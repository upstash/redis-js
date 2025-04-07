import type { CommandOptions } from "./command";
import { Command } from "./command";

export class HPExpireCommand extends Command<(-2 | 0 | 1 | 2)[], (-2 | 0 | 1 | 2)[]> {
  constructor(
    cmd: [key: string, fields: (string | number) | (string | number)[], milliseconds: number],
    opts?: CommandOptions<(-2 | 0 | 1 | 2)[], (-2 | 0 | 1 | 2)[]>
  ) {
    const [key, fields, milliseconds] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["hpexpire", key, milliseconds, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
}
