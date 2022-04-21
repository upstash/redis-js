import { Command } from "./command";

/**
 * @see https://redis.io/commands/incrby
 */
export class IncrByCommand extends Command<number, number> {
	constructor(key: string, value: number) {
		super(["incrby", key, value]);
	}
}
