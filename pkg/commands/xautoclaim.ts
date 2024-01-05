import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/xautoclaim
 */
export class XAutoClaim extends Command<unknown[], unknown[]> {
  constructor(
    [key, group, consumer, minIdleTime, start, options]: [
      key: string,
      group: string,
      consumer: string,
      minIdleTime: number,
      start: string,
      options?: { count?: number; justId?: boolean }
    ],
    opts?: CommandOptions<unknown[], unknown[]>
  ) {
    const commands: unknown[] = [];

    if (options?.count) {
      commands.push("COUNT", options.count);
    }

    if (options?.justId) {
      commands.push("JUSTID");
    }
    super(
      ["XAUTOCLAIM", key, group, consumer, minIdleTime, start, ...commands],
      opts
    );
  }
}
