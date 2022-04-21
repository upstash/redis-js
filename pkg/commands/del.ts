import { NonEmptyArray } from "../types";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/del
 */
export class DelCommand extends Command<number, number> {
	constructor(...keys: NonEmptyArray<string>) {
		super(["del", ...keys]);
	}
}
