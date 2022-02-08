import { openStdin } from "process";
import { HttpClient } from "./http";
import { UpstashResponse } from "./types";

export interface ICommand<TResult> {
  command: string[];
  exec: (client: HttpClient) => Promise<UpstashResponse<TResult>>;
}

/**
 * Generic string command that gets extended by specific commands such as `get` and `set`
 */
export abstract class Command<TResult = string> implements ICommand<TResult> {
  public readonly command: string[];
  constructor(command: (string | unknown)[]) {
    this.command = command.map((c) =>
      typeof c === "string" ? c : JSON.stringify(c)
    );
  }
  public async exec(client: HttpClient): Promise<UpstashResponse<TResult>> {
    const res = await client.post<UpstashResponse<TResult>>({
      body: this.command,
    });
    if (res.error) {
      return res;
    }
    try {
      /**
       * Try to parse the response if possible
       */
      const result = Array.isArray(res.result)
        ? res.result.map((r) => JSON.parse(r))
        : JSON.parse(res.result as unknown as string);

      return {
        ...res,
        result,
      };
    } catch {
      return res;
    }
  }
}
