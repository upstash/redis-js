import type { CommandOptions } from "./command";
import { Command } from "./command";
import type { ExpireOption } from "./expire";

export class HExpireCommand extends Command<(-2 | 0 | 1 | 2)[], (-2 | 0 | 1 | 2)[]> {
  constructor(
    cmd: [
      key: string,
      fields: (string | number) | (string | number)[],
      seconds: number,
      option?: ExpireOption,
    ],
    opts?: CommandOptions<(-2 | 0 | 1 | 2)[], (-2 | 0 | 1 | 2)[]>
  ) {
    const [key, fields, seconds, option] = cmd;
    const fieldArray = Array.isArray(fields) ? fields : [fields];
    super(
      [
        "hexpire",
        key,
        seconds,
        ...(option ? [option] : []),
        "FIELDS",
        fieldArray.length,
        ...fieldArray,
      ],
      opts
    );
  }
}
