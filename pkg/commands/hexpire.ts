import type { CommandOptions } from "./command";
import { Command } from "./command";

type HExpireOptions = "NX" | "nx" | "XX" | "xx" | "GT" | "gt" | "LT" | "lt";
export class HExpireCommand extends Command<("-2" | "0" | "1" | "2")[], (-2 | 0 | 1 | 2)[]> {
  constructor(
    cmd: [
      key: string,
      fields: (string | number) | (string | number)[],
      seconds: number,
      option?: HExpireOptions,
    ],
    opts?: CommandOptions<("-2" | "0" | "1" | "2")[], (-2 | 0 | 1 | 2)[]>
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
