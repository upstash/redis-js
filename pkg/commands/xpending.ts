import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/xpending
 */
export class XPendingCommand extends Command<unknown[], unknown[]> {
  constructor(
    [key, group, start, end, count, options]: [
      key: string,
      group: string,
      start: string,
      end: string,
      count: number,
      options?: {
        idleTime?: number;
        consumer?: string | string[];
      },
    ],
    opts?: CommandOptions<unknown[], unknown[]>
  ) {
    const consumers =
      typeof options?.consumer !== "undefined"
        ? Array.isArray(options.consumer)
          ? [...options.consumer]
          : [options.consumer]
        : [];

    super(
      [
        "XPENDING",
        key,
        group,
        ...(options?.idleTime ? ["IDLE", options.idleTime] : []),
        start,
        end,
        count,
        ...consumers,
      ],
      opts
    );
  }
}
