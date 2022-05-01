import { Command, CommandOptions } from "./command.ts";

export type Type = "string" | "list" | "set" | "zset" | "hash" | "none";
/**
 * @see https://redis.io/commands/type
 */
export class TypeCommand extends Command<Type, Type> {
  constructor(cmd: [key: string], opts?: CommandOptions<Type, Type>) {
    super(["type", ...cmd], opts);
  }
}
