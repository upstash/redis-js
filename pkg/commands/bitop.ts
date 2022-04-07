import { Command } from "./command"

/**
 * @see https://redis.io/commands/bitop
 */
export class BitOpCommand extends Command<number, number> {
  constructor(
    cmd: [
      op: "and" | "or" | "xor",
      destinationKey: string,
      sourceKey: string,
      ...sourceKeys: string[]
    ],
  )
  constructor(cmd: [op: "not", destinationKey: string, sourceKey: string])
  constructor(
    cmd: [
      op: "and" | "or" | "xor" | "not",
      destinationKey: string,
      sourceKeys: string,
      ...sourceKeys: string[]
    ],
  ) {
    super(["bitop", ...cmd])
  }
}
