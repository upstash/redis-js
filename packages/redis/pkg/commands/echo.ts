import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/echo
 * @see node_modules/@upstash/redis/docs/commands/auth/echo.mdx
 */
export class EchoCommand extends Command<string, string> {
  constructor(cmd: [message: string], opts?: CommandOptions<string, string>) {
    super(["echo", ...cmd], opts);
  }
}
