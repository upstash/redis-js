import { Command, CommandOptions } from "./command.ts";

type RadiusOptions = "M" | "KM" | "FT" | "MI";
type CenterPoint<TMemberType> =
  | {
      type: "FROMMEMBER" | "frommember";
      member: TMemberType;
    }
  | {
      type: "FROMLONLAT" | "fromlonlat";
      coordinate: { lon: number; lat: number };
    };

type Shape =
  | { type: "BYRADIUS" | "byradius"; radius: number; radiusType: RadiusOptions }
  | {
      type: "BYBOX" | "bybox";
      rect: { width: number; height: number };
      rectType: RadiusOptions;
    };

type GeoSearchCommandOptions = {
  count?: { limit: number; any?: boolean };
  withCoord?: boolean;
  withDist?: boolean;
  withHash?: boolean;
};

type OptionMappings = {
  withHash: "hash";
  withCoord: "coord";
  withDist: "dist";
};

type GeoSearchOptions<TOptions> = {
  [K in keyof TOptions as K extends keyof OptionMappings
    ? OptionMappings[K]
    : never]: K extends "withHash"
    ? string
    : K extends "withCoord"
      ? { long: number; lat: number }
      : K extends "withDist"
        ? number
        : never;
};

type GeoSearchResponse<TOptions, TMemberType> = ({
  member: TMemberType;
} & GeoSearchOptions<TOptions>)[];

/**
 * @see https://redis.io/commands/geosearch
 */
export class GeoSearchCommand<
  TMemberType = string,
  TOptions extends GeoSearchCommandOptions = GeoSearchCommandOptions,
> extends Command<any[] | any[][], GeoSearchResponse<TOptions, TMemberType>> {
  constructor(
    [key, centerPoint, shape, order, opts]: [
      key: string,
      centerPoint: CenterPoint<TMemberType>,
      shape: Shape,
      order: "ASC" | "DESC" | "asc" | "desc",
      opts?: TOptions,
    ],
    commandOptions?: CommandOptions<any[] | any[][], GeoSearchResponse<TOptions, TMemberType>>
  ) {
    const command: unknown[] = ["GEOSEARCH", key];

    if (centerPoint.type === "FROMMEMBER" || centerPoint.type === "frommember") {
      command.push(centerPoint.type, centerPoint.member);
    }
    if (centerPoint.type === "FROMLONLAT" || centerPoint.type === "fromlonlat") {
      command.push(centerPoint.type, centerPoint.coordinate.lon, centerPoint.coordinate.lat);
    }

    if (shape.type === "BYRADIUS" || shape.type === "byradius") {
      command.push(shape.type, shape.radius, shape.radiusType);
    }
    if (shape.type === "BYBOX" || shape.type === "bybox") {
      command.push(shape.type, shape.rect.width, shape.rect.height, shape.rectType);
    }
    command.push(order);

    if (opts?.count) {
      command.push("COUNT", opts.count.limit, ...(opts.count.any ? ["ANY"] : []));
    }

    const transform = (result: string[] | string[][]) => {
      if (!opts?.withCoord && !opts?.withDist && !opts?.withHash) {
        return result.map((member) => {
          try {
            return { member: JSON.parse(member as string) };
          } catch {
            return { member };
          }
        });
      }
      return result.map((members) => {
        let counter = 1;
        const obj = {} as any;

        try {
          obj.member = JSON.parse(members[0] as string);
        } catch {
          obj.member = members[0];
        }

        if (opts.withDist) {
          obj.dist = parseFloat(members[counter++]);
        }
        if (opts.withHash) {
          obj.hash = members[counter++].toString();
        }
        if (opts.withCoord) {
          obj.coord = {
            long: parseFloat(members[counter][0]),
            lat: parseFloat(members[counter][1]),
          };
        }
        return obj;
      });
    };

    super(
      [
        ...command,
        ...(opts?.withCoord ? ["WITHCOORD"] : []),
        ...(opts?.withDist ? ["WITHDIST"] : []),
        ...(opts?.withHash ? ["WITHHASH"] : []),
      ],
      {
        deserialize: transform,
        ...commandOptions,
      }
    );
  }
}
