import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/xclaim
 */
export class XClaimCommand extends Command<unknown[], unknown[]> {
  constructor(
    [key, group, consumer, minIdleTime, id, options]: [
      key: string,
      group: string,
      consumer: string,
      minIdleTime: number,
      id: string | string[],
      options?: {
        idleMS?: number;
        timeMS?: number;
        retryCount?: number;
        force?: boolean;
        justId?: boolean;
        lastId?: number;
      }
    ],
    opts?: CommandOptions<unknown[], unknown[]>
  ) {
    const ids = Array.isArray(id) ? [...id] : [id];
    const commands: unknown[] = [];

    if (options?.idleMS) {
      commands.push("IDLE", options.idleMS);
    }

    if (options?.idleMS) {
      commands.push("TIME", options.timeMS);
    }

    if (options?.retryCount) {
      commands.push("RETRYCOUNT", options?.retryCount);
    }

    if (options?.force) {
      commands.push("FORCE");
    }

    if (options?.justId) {
      commands.push("JUSTID");
    }

    if (options?.lastId) {
      commands.push("LASTID", options.lastId);
    }

    super(
      ["XCLAIM", key, group, consumer, minIdleTime, ...ids, ...commands],
      opts
    );
  }
}
