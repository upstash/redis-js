import { kvArrayToObject } from "../util";
import type { CommandOptions } from "./command";
import { Command } from "./command";

export type FunctionListArgs = {
  /**
   * Pattern for matching library names. Supports glob patterns.
   *
   * Example: "my_library_*"
   */
  libraryName?: string;
  /**
   * Includes the library source code in the response.
   *
   * @default false
   */
  withCode?: boolean;
};

type RedisFunctionLibrary = {
  libraryName: string;
  engine: string;
  functions: {
    name: string;
    description?: string;
    flags: string[];
  }[];
  libraryCode?: string;
};

/**
 * @see https://redis.io/docs/latest/commands/function-list/
 */
export class FunctionListCommand extends Command<unknown, RedisFunctionLibrary[]> {
  constructor(
    [args]: [args?: FunctionListArgs],
    opts?: CommandOptions<unknown, RedisFunctionLibrary[]>
  ) {
    const command: (string | number | boolean)[] = ["function", "list"];
    if (args?.libraryName) {
      command.push("libraryname", args.libraryName);
    }
    if (args?.withCode) {
      command.push("withcode");
    }
    super(command, { deserialize, ...opts });
  }
}

function deserialize(result: unknown): RedisFunctionLibrary[] {
  if (!Array.isArray(result)) return [];

  return result.map((libRaw) => {
    const lib = kvArrayToObject<{
      library_name: string;
      engine: string;
      functions: unknown[];
      library_code: string;
    }>(libRaw);

    const functionsParsed = lib.functions.map((fnRaw) =>
      kvArrayToObject<{ name: string; description: string | null; flags: string[] }>(fnRaw)
    );

    return {
      libraryName: lib.library_name,
      engine: lib.engine,
      functions: functionsParsed.map((fn) => ({
        name: fn.name,
        description: fn.description ?? undefined,
        flags: fn.flags,
      })),
      libraryCode: lib.library_code,
    };
  });
}
