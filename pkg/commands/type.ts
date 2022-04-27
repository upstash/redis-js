import { Command } from "./command.ts";

export type Type = "string" | "list" | "set" | "zset" | "hash" | "none";
/**
 * @see https://redis.io/commands/type
 */
export class TypeCommand extends Command<Type, Type> {
  constructor(key: string) {
    super(["type", key]);
  }
}
