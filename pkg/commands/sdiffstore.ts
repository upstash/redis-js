import { NonEmptyArray } from "../types.ts";
import { Command } from "./command.ts";
/**
 * @see https://redis.io/commands/sdiffstpre
 */
export class SDiffStoreCommand extends Command<number, number> {
  constructor(destination: string, ...keys: NonEmptyArray<string>) {
    super(["sdiffstore", destination, ...keys]);
  }
}
