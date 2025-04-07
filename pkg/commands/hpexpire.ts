import type { CommandOptions } from "./command";
import { Command } from "./command";
import type { ExpireOptions } from "./expire";

export class HPExpireCommand extends Command<(-2 | 0 | 1 | 2)[], (-2 | 0 | 1 | 2)[]> {
  constructor(
    cmd: [
      key: string,
      fields: (string | number) | (string | number)[],
      milliseconds: number,
      option?: ExpireOptions,
    ],
    opts?: CommandOptions<(-2 | 0 | 1 | 2)[], (-2 | 0 | 1 | 2)[]>
  ) {
    const [key, fields, milliseconds, option] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(
      [
        "hpexpire",
        key,
        milliseconds,
        ...(option ? [option] : []),
        "FIELDS",
        fieldArray.length,
        ...fieldArray,
      ],
      opts
    );
  }
}
