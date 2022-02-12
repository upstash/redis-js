import { Command } from "../command"

/**
 * @see https://redis.io/commands/type
 */
export class TypeCommand extends Command<"string" | "list" | "set" | "zset" | "hash" | "stream"> {
  constructor(key: string) {
    super(["type", key])
  }
}
