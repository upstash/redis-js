import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/sunionstore
 */
export class SUnionStoreCommand extends Command<number, number> {
  constructor(destination: string, key: string, ...keys: string[]) {
    super(["sunionstore", destination, key, ...keys]);
  }
}
