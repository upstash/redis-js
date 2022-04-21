import { Command } from "./command";

/**
 * @see https://redis.io/commands/bitop
 */
export class BitOpCommand extends Command<number, number> {
	constructor(
		op: "and" | "or" | "xor",
		destinationKey: string,
		sourceKey: string,
		...sourceKeys: string[]
	);
	constructor(op: "not", destinationKey: string, sourceKey: string);
	constructor(
		op: "and" | "or" | "xor" | "not",
		destinationKey: string,
		sourceKey: string,
		...sourceKeys: string[]
	) {
		super(["bitop", op, destinationKey, sourceKey, ...sourceKeys]);
	}
}
