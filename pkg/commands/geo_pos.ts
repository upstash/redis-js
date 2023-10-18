import { Command, CommandOptions } from "./command.ts";

type Coordinates = {
  lng: string;
  lat: string;
};

/**
 * @see https://redis.io/commands/geopos
 */
export class GeoPosCommand<TData extends Coordinates[]> extends Command<
  (string | null)[][],
  TData
> {
  constructor(
    cmd: [string, ...string[]] | [string, string[]],
    opts?: CommandOptions<(string | null)[][], TData>
  ) {
    const [key] = cmd;
    // Check if the second argument is an array of strings (members).
    // If it is, use it directly; if not, it means the members were passed individually,
    // so we slice the cmd from the second element onwards to get the members.
    const members = Array.isArray(cmd[1]) ? cmd[1] : cmd.slice(1);

    super(["GEOPOS", key, ...members], {
      deserialize: (result) => transform(result),
      ...opts,
    });
  }
}

function transform<TData extends Coordinates[]>(result: (string | null)[][]): TData {
  const final: Coordinates[] = [];
  for (const pos of result) {
    if (!pos?.[0] || !pos?.[1]) continue;
    final.push({ lng: pos[0], lat: pos[1] });
  }
  return final as TData;
}
