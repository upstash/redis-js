import { Command } from "./command";

/**
 * @see https://redis.io/commands/strlen
 */
export class StrLenCommand extends Command<number, number> {
	constructor(key: string) {
		super(["strlen", key]);
	}
}
