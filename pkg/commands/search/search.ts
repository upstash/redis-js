import type {
  FlatIndexSchema,
  NestedIndexSchema,
  QueryOptions,
  QueryFilter,
  IndexDescription,
  QueryResult,
  Language,
} from "./types";
import type { Requester } from "../../http";
import { ExecCommand } from "../exec";
import { buildCreateIndexCommand, buildQueryCommand } from "./command-builder";
import { parseCountResponse, deserializeDescribeResponse, deserializeQueryResponse } from "./utils";

export type createIndexProps<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  name: string;
  prefix: string | string[];
  language?: Language;
  client: Requester;
} & (
  | { dataType: "string"; schema: TSchema extends NestedIndexSchema ? TSchema : never }
  | { dataType: "hash"; schema: TSchema extends FlatIndexSchema ? TSchema : never }
);

export type SearchIndexProps<TSchema extends NestedIndexSchema | FlatIndexSchema> = Pick<
  createIndexProps<TSchema>,
  "name" | "client"
> & { schema?: createIndexProps<TSchema>["schema"] };

export class SearchIndex<TSchema extends NestedIndexSchema | FlatIndexSchema> {
  readonly name: SearchIndexProps<TSchema>["name"];
  readonly schema?: TSchema;
  private client: Requester;

  constructor({ name, schema, client }: SearchIndexProps<TSchema>) {
    this.name = name;
    this.schema = schema;
    this.client = client;
  }

  async waitIndexing(): Promise<string> {
    const command = ["SEARCH.COMMIT", this.name];
    const result = await new ExecCommand<string>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }

  async describe(): Promise<IndexDescription<TSchema>> {
    const command = ["SEARCH.DESCRIBE", this.name];
    const rawResult = await new ExecCommand<any>(command as [string, ...string[]]).exec(
      this.client
    );
    return deserializeDescribeResponse<TSchema>(rawResult);
  }

  async query<TOptions extends QueryOptions<TSchema>>(
    options: TOptions
  ): Promise<QueryResult<TSchema, TOptions>[]> {
    const command = buildQueryCommand<TSchema>("SEARCH.QUERY", this.name, options);
    const rawResult = await new ExecCommand<string[]>(command as [string, ...string[]]).exec(
      this.client
    );
    return deserializeQueryResponse<TSchema, TOptions>(rawResult, options);
  }

  async count({ filter }: { filter: QueryFilter<TSchema> }): Promise<number> {
    const command = buildQueryCommand("SEARCH.COUNT", this.name, { filter });
    const rawResult = await new ExecCommand<any>(command as [string, ...string[]]).exec(
      this.client
    );
    return parseCountResponse(rawResult);
  }

  async drop(): Promise<string> {
    const command = ["SEARCH.DROP", this.name];
    const result = await new ExecCommand<string>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }
}

export async function createIndex<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  props: createIndexProps<TSchema>
) {
  const { name, schema, client } = props;
  const createIndexCommand = buildCreateIndexCommand<TSchema>(props);
  await new ExecCommand<string>(createIndexCommand as [string, ...string[]]).exec(client);
  return index(client, name, schema);
}

export function index<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  client: Requester,
  name: SearchIndexProps<TSchema>["name"],
  schema?: SearchIndexProps<TSchema>["schema"]
) {
  return new SearchIndex<TSchema>({ name, schema, client });
}
