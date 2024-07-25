import { Command, CommandOptions } from "./command";

export type GeoAddCommandOptions =
  | {
      nx?: boolean;
      xx?: never;
    }
  | ({
      nx?: never;
      xx?: boolean;
    } & { ch?: boolean });

export interface GeoMember<TMemberType> {
  latitude: number;
  longitude: number;
  member: TMemberType;
}

/**
 * @see https://redis.io/commands/geoadd
 */
export class GeoAddCommand<TMemberType = string> extends Command<number | null, number | null> {
  constructor(
    [key, arg1, ...arg2]: [
      string,
      GeoMember<TMemberType> | GeoAddCommandOptions,
      ...GeoMember<TMemberType>[],
    ],
    opts?: CommandOptions<number | null, number | null>
  ) {
    const command: unknown[] = ["geoadd", key];

    if ("nx" in arg1 && arg1.nx) {
      command.push("nx");
    } else if ("xx" in arg1 && arg1.xx) {
      command.push("xx");
    }

    if ("ch" in arg1 && arg1.ch) {
      command.push("ch");
    }

    if ("latitude" in arg1 && arg1.latitude) {
      command.push(arg1.longitude, arg1.latitude, arg1.member);
    }

    command.push(
      ...arg2.flatMap(({ latitude, longitude, member }) => [longitude, latitude, member])
    );

    super(command, opts);
  }
}
