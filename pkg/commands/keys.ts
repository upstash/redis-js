import { Command } from "./command";

/**
 * @see https://redis.io/commands/keys
 */
export class KeysCommand extends Command<string[], string[]> {
	constructor(pattern: string) {
		super(["keys", pattern]);
	}
}
