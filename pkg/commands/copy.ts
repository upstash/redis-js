import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/copy
 */
export class CopyCommand extends Command<number, "COPIED" | "NOT_COPIED"> {
  constructor(
    [key, destinationKey, opts]: [key: string, destinationKey: string, opts?: { replace: boolean }],
    commandOptions?: CommandOptions<number, "COPIED" | "NOT_COPIED">,
  ) {
    super(["COPY", key, destinationKey, ...(opts?.replace ? ["REPLACE"] : [])], {
      ...commandOptions,
      deserialize(result) {
        if (result > 0) {
          return "COPIED";
        }
        return "NOT_COPIED";
      },
    });
  }
}
