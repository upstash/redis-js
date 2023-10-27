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
  storeDist?: boolean;
};

/**
 * @see https://redis.io/commands/geosearchstore
 */
export class GeoSearchStoreCommand<
  TMemberType = string,
  TOptions extends GeoSearchCommandOptions = GeoSearchCommandOptions,
> extends Command<any[] | any[][], number> {
  constructor(
    [destination, key, centerPoint, shape, order, opts]: [
      destination: string,
      key: string,
      centerPoint: CenterPoint<TMemberType>,
      shape: Shape,
      order: "ASC" | "DESC" | "asc" | "desc",
      opts?: TOptions,
    ],
    commandOptions?: CommandOptions<any[] | any[][], number>,
  ) {
    const command: unknown[] = ["GEOSEARCHSTORE", destination, key];

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
      command.push(opts.count.limit, ...(opts.count.any ? ["ANY"] : []));
    }

    super([...command, ...(opts?.storeDist ? ["STOREDIST"] : [])], commandOptions);
  }
}
