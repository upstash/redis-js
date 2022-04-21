import { Command } from "./command";

/**
 * @see https://redis.io/commands/mset
 */
export class MSetCommand<TData> extends Command<"OK", "OK"> {
	constructor(kv: { [key: string]: TData }) {
		super([
			"mset",
			...Object.entries(kv).flatMap(([key, value]) => [key, value]),
		]);
	}
}
