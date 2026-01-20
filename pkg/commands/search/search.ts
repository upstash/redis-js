import type {
  FlatIndexSchema,
  NestedIndexSchema,
  QueryOptions,
  RootQueryFilter,
  IndexDescription,
  QueryResult,
  Language,
} from "./types";
import type { Requester } from "../../http";
import { ExecCommand } from "../exec";
import { buildCreateIndexCommand, buildQueryCommand } from "./command-builder";
import { parseCountResponse, deserializeDescribeResponse, deserializeQueryResponse } from "./utils";

export type CreateIndexProps<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  name: string;
  prefix: string | string[];
  language?: Language;
  skipInitialScan?: boolean;
  existsOk?: boolean;
} & (
  | { dataType: "string"; schema: TSchema extends NestedIndexSchema ? TSchema : never }
  | { dataType: "json"; schema: TSchema extends NestedIndexSchema ? TSchema : never }
  | { dataType: "hash"; schema: TSchema extends FlatIndexSchema ? TSchema : never }
);

export type SearchIndexProps<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  name: string;
  client: Requester;
  schema?: TSchema;
};

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
    const command = ["SEARCH.WAITINDEXING", this.name];
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

  async query(
    options?: QueryOptions<TSchema>
  ): Promise<QueryResult<TSchema, QueryOptions<TSchema>>[]> {
    const command = buildQueryCommand<TSchema>("SEARCH.QUERY", this.name, options);
    const rawResult = await new ExecCommand<string[]>(command as [string, ...string[]]).exec(
      this.client
    );
    return deserializeQueryResponse<TSchema, QueryOptions<TSchema>>(rawResult);
  }

  async count({ filter }: { filter: RootQueryFilter<TSchema> }): Promise<{ count: number }> {
    const command = buildQueryCommand<TSchema>("SEARCH.COUNT", this.name, { filter });
    const rawResult = await new ExecCommand<any>(command as [string, ...string[]]).exec(
      this.client
    );
    return { count: parseCountResponse(rawResult) };
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
  client: Requester,
  props: CreateIndexProps<TSchema>
) {
  const { name, schema } = props;
  const createIndexCommand = buildCreateIndexCommand<TSchema>(props);
  await new ExecCommand<string>(createIndexCommand as [string, ...string[]]).exec(client);
  return index(client, name, schema);
}

export function index<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  client: Requester,
  name: string,
  schema: TSchema
): SearchIndex<TSchema>;
export function index(client: Requester, name: string): SearchIndex<any>;
export function index<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  client: Requester,
  name: string,
  schema?: TSchema
): SearchIndex<TSchema> | SearchIndex<any> {
  return new SearchIndex<TSchema>({ name, schema, client });
}

export type InferFilterFromSchema<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  NonNullable<NonNullable<Parameters<SearchIndex<TSchema>["query"]>[0]>["filter"]>;
