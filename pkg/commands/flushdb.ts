import { Command } from "./command";
/**
 * @see https://redis.io/commands/flushdb
 */
export class FlushDBCommand extends Command<"OK", "OK"> {
	constructor(opts?: { async?: boolean }) {
		const command = ["flushdb"];
		if (opts?.async) {
			command.push("async");
		}
		super(command);
	}
}
