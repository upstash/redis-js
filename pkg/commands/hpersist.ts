import type { CommandOptions } from "./command";
import { Command } from "./command";

export class HPersistCommand extends Command<(-2 | -1 | 2)[], (-2 | -1 | 2)[]> {
  constructor(
    cmd: [key: string, fields: (string | number) | (string | number)[]],
    opts?: CommandOptions<(-2 | -1 | 2)[], (-2 | -1 | 2)[]>
  ) {
    const [key, fields] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(["hpersist", key, "FIELDS", fieldArray.length, ...fieldArray], opts);
  }
}
