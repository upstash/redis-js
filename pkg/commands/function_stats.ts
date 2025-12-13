import { kvArrayToObject } from "../util";
import type { CommandOptions } from "./command";
import { Command } from "./command";

type RedisFunctionStats = ReturnType<typeof deserialize>;

/**
 * @see https://redis.io/docs/latest/commands/function-stats/
 *
 * Note: `running_script` is always null in Upstash and therefore not included in the type.
 */
export class FunctionStatsCommand extends Command<unknown, RedisFunctionStats> {
  constructor(opts?: CommandOptions<unknown, RedisFunctionStats>) {
    super(["function", "stats"], { deserialize, ...opts });
  }
}

function deserialize(result: unknown) {
  // Object of { engines: { LUA: [k1, v1, k2, v2, ...] }}
  const rawEngines = kvArrayToObject(kvArrayToObject(result).engines);

  // Parses inside LUA: [k1, v1 ...] into LUA: { libraries_count: v1, functions_count: v2 }
  const parsedEngines = Object.fromEntries(
    Object.entries(rawEngines).map(([key, value]) => [key, kvArrayToObject(value)])
  );

  // Converts to camelCased keys
  const final = {
    engines: Object.fromEntries(
      Object.entries(parsedEngines).map(([key, value]) => [
        key,
        {
          librariesCount: value.libraries_count,
          functionsCount: value.functions_count,
        },
      ])
    ),
  };

  return final;
}
