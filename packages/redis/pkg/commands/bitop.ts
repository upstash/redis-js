import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/bitop
 */
export class BitOpCommand extends Command<number, number> {
  constructor(
    cmd: [op: "and" | "or" | "xor", destinationKey: string, ...sourceKeys: string[]],
    opts?: CommandOptions<number, number>
  );
  constructor(
    cmd: [op: "not", destinationKey: string, sourceKey: string],
    opts?: CommandOptions<number, number>
  );
  constructor(
    cmd: [op: "diff" | "diff1" | "andor", destinationKey: string, x: string, ...y: string[]],
    opts?: CommandOptions<number, number>
  );
  constructor(
    cmd: [op: "one", destinationKey: string, ...sourceKeys: string[]],
    opts?: CommandOptions<number, number>
  );
  constructor(
    cmd: [
      op: "and" | "or" | "xor" | "not" | "diff" | "diff1" | "andor" | "one",
      destinationKey: string,
      ...sourceKeys: string[],
    ],
    opts?: CommandOptions<number, number>
  ) {
    super(["bitop", ...cmd], opts);
  }
}
