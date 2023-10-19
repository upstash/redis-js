import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/geodist
 */
export class GeoDistCommand<TMemberType = string>
  extends Command<number | null, number | null> {
  constructor(
    [key, member1, member2, unit = "M"]: [
      key: string,
      member1: TMemberType,
      member2: TMemberType,
      unit?: "M" | "KM" | "FT" | "MI",
    ],
    opts?: CommandOptions<number | null, number | null>,
  ) {
    super(["GEODIST", key, member1, member2, unit], opts);
  }
}
