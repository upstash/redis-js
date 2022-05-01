import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/bitcount
 */
export class BitCountCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, start?: never, end?: never],
    opts?: CommandOptions<number, number>,
  );
  constructor(
    cmd: [key: string, start: number, end: number],
    opts?: CommandOptions<number, number>,
  );
  constructor(
    [key, start, end]: [key: string, start?: number, end?: number],
    opts?: CommandOptions<number, number>,
  ) {
    const command: unknown[] = ["bitcount", key];
    if (typeof start === "number") {
      command.push(start);
    }
    if (typeof end === "number") {
      command.push(end);
    }
    super(command, opts);
  }
}
