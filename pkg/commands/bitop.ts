import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/bitop
 */
export class BitOpCommand extends Command<number, number> {
  constructor(
    cmd: [
      op: "and" | "or" | "xor",
      destinationKey: string,
      ...sourceKeys: string[],
    ],
    opts?: CommandOptions<number, number>,
  );
  constructor(
    cmd: [op: "not", destinationKey: string, sourceKey: string],
    opts?: CommandOptions<number, number>,
  );
  constructor(
    cmd: [
      op: "and" | "or" | "xor" | "not",
      destinationKey: string,
      ...sourceKeys: string[],
    ],
    opts?: CommandOptions<number, number>,
  ) {
    super(["bitop", ...cmd], opts);
  }
}
