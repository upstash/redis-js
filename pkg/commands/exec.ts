import  { type CommandOptions, Command } from "./command";

/**
 * Generic exec command for executing arbitrary Redis commands
 * Allows executing Redis commands that might not be directly supported by the SDK
 * 
 * @example
 * // Execute MEMORY USAGE command
 * await redis.exec<number>("MEMORY", "USAGE", "myKey")
 * 
 * // Execute GET command
 * await redis.exec<string>("GET", "foo")
 */

export class ExecCommand<TResult> extends Command<TResult, TResult> {
	constructor(
		cmd: [command: string, ...args: (string | number | boolean)[]],
		opts?: CommandOptions<TResult, TResult>
	){
		const normalizedCmd = cmd.map(arg => typeof arg === "string" ? arg : String(arg));
		super(normalizedCmd, opts);
	}
}