import { Command } from "./command";
/**
 * @see https://redis.io/commands/zcount
 */
export class ZCountCommand extends Command<number, number> {
	constructor(key: string, min: number | string, max: number | string) {
		super(["zcount", key, min, max]);
	}
}
