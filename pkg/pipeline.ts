import { ICommand } from "./command";
import { HttpClient } from "./http";
import { UpstashResponse } from "../dist";
/**
 * Pipeline takes multiple `Command`s and makes a batched request
 */
export class Pipeline<TResult extends unknown[] = unknown[]>
  implements ICommand<TResult>
{
  public command: string[] = []; // TODO: Remove
  public commands: ICommand<unknown>[];
  constructor(commands: ICommand<unknown>[]) {
    this.commands = commands;
  }
  public async exec(client: HttpClient): Promise<UpstashResponse<TResult>> {
    return await client.post<UpstashResponse<TResult>>({
      body: this.commands.map((c) => c.command),
    });
  }
}
