import { Command } from "./command"

export type ZInterStoreCommandOptions = {
  aggregate?: "sum" | "min" | "max"
} & (
  | {
      weight: number
      weights?: never
    }
  | {
      weight?: never
      weights: number[]
    }
  | {
      weight?: never
      weights?: never
    }
)

/**
 * @see https://redis.io/commands/zInterstore
 */
export class ZInterStoreCommand extends Command<number, number> {
  constructor(destination: string, numKeys: 1, key: string, opts?: ZInterStoreCommandOptions)
  constructor(
    destination: string,
    numKeys: number,
    keys: string[],
    opts?: ZInterStoreCommandOptions,
  )
  constructor(
    destination: string,
    numKeys: number,
    keyOrKeys: string | string[],
    opts?: ZInterStoreCommandOptions,
  ) {
    const command: unknown[] = ["zinterstore", destination, numKeys]
    if (Array.isArray(keyOrKeys)) {
      command.push(...keyOrKeys)
    } else {
      command.push(keyOrKeys)
    }
    if (opts) {
      if ("weights" in opts && opts.weights) {
        command.push("weights", ...opts.weights)
      } else if ("weight" in opts && typeof opts.weight === "number") {
        command.push("weights", opts.weight)
      }
      if ("aggregate" in opts) {
        command.push("aggregate", opts.aggregate)
      }
    }
    super(command)
  }
}
