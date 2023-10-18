import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/geodist
 */
export class GeoDistCommand extends Command<number | null, number | null> {
  constructor(
    [key, member1, member2, unit = "M"]: [
      key: string,
      member1: string,
      member2: string,
      unit?: "M" | "KM" | "FT" | "MI",
    ],
    opts?: CommandOptions<number | null, number | null>,
  ) {
    const command: unknown[] = ["GEODIST", key];
    command.push(member1, member2, unit);

    super(command, opts);
  }
}
