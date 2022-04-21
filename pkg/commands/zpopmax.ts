import { Command } from "./command";
/**
 * @see https://redis.io/commands/zpopmax
 */
export class ZPopMaxCommand<TData> extends Command<TData[], string[]> {
	constructor(key: string, count?: number) {
		const command: unknown[] = ["zpopmax", key];
		if (typeof count === "number") {
			command.push(count);
		}
		super(command);
	}
}
