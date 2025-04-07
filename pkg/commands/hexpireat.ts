import type { CommandOptions } from "./command";
import { Command } from "./command";
import type { ExpireOptions } from "./expire";

export class HExpireAtCommand extends Command<(-2 | 0 | 1 | 2)[], (-2 | 0 | 1 | 2)[]> {
  constructor(
    cmd: [
      key: string,
      fields: (string | number) | (string | number)[],
      timestamp: number,
      option?: ExpireOptions,
    ],
    opts?: CommandOptions<(-2 | 0 | 1 | 2)[], (-2 | 0 | 1 | 2)[]>
  ) {
    const [key, fields, timestamp, option] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(
      [
        "hexpireat",
        key,
        timestamp,
        ...(option ? [option] : []),
        "FIELDS",
        fieldArray.length,
        ...fieldArray,
      ],
      opts
    );
  }
}
