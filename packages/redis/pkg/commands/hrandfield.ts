import type { CommandOptions } from "./command";
import { Command } from "./command";

function deserialize<TData extends Record<string, unknown>>(result: string[]): TData | null {
  if (result.length === 0) {
    return null;
  }
  const obj: Record<string, unknown> = {};
  for (let i = 0; i < result.length; i += 2) {
    const key = result[i];
    const value = result[i + 1];
    try {
      obj[key] = JSON.parse(value);
    } catch {
      obj[key] = value;
    }
  }
  return obj as TData;
}

/**
 * @see https://redis.io/commands/hrandfield
 */
export class HRandFieldCommand<
  TData extends string | string[] | Record<string, unknown>,
> extends Command<string | string[], TData> {
  constructor(cmd: [key: string], opts?: CommandOptions<string, string>);
  constructor(cmd: [key: string, count: number], opts?: CommandOptions<string[], string[]>);
  constructor(
    cmd: [key: string, count: number, withValues: boolean],
    opts?: CommandOptions<string[], Partial<TData>>
  );
  constructor(
    cmd: [key: string, count?: number, withValues?: boolean],
    opts?: CommandOptions<any, string | string[] | Partial<TData>>
  ) {
    const command = ["hrandfield", cmd[0]] as unknown[];
    if (typeof cmd[1] === "number") {
      command.push(cmd[1]);
    }
    if (cmd[2]) {
      command.push("WITHVALUES");
    }
    super(command, {
      // @ts-expect-error to silence compiler
      deserialize: cmd[2] ? (result) => deserialize(result as string[]) : opts?.deserialize,
      ...opts,
    });
  }
}
