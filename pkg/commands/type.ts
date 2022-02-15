import { Command } from "../command"

/**
 * @see https://redis.io/commands/type
 */
export class TypeCommand extends Command<"string" | "list" | "set" | "zset" | "hash" | "none"> {
  constructor(key: string) {
    super(["type", key])
  }
}
