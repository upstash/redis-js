import { Command } from "./command";

/**
 * @see https://redis.io/commands/hincrbyfloat
 */
export class HIncrByFloatCommand extends Command<number, number> {
	constructor(key: string, field: string, increment: number) {
		super(["hincrbyfloat", key, field, increment]);
	}
}
