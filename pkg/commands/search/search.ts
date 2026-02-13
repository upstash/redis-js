import type {
  AggregateOptions,
  AggregateResult,
  FlatIndexSchema,
  IndexDescription,
  Language,
  NestedIndexSchema,
  QueryOptions,
  QueryResult,
  RootQueryFilter,
} from "./types";
import type { Requester } from "../../http";
import { ExecCommand } from "../exec";
import {
  buildAggregateCommand,
  buildCreateIndexCommand,
  buildQueryCommand,
} from "./command-builder";
import {
  deserializeAggregateResponse,
  deserializeDescribeResponse,
  deserializeQueryResponse,
  parseCountResponse,
} from "./utils";

export type CreateIndexParameters<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
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

export type InitIndexParameters<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  name: string;
  schema?: TSchema;
};

export type SearchIndexParameters<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  name: string;
  client: Requester;
  schema?: TSchema;
};

export class SearchIndex<TSchema extends NestedIndexSchema | FlatIndexSchema> {
  readonly name: SearchIndexParameters<TSchema>["name"];
  readonly schema?: TSchema;
  private client: Requester;

  constructor({ name, schema, client }: SearchIndexParameters<TSchema>) {
    this.name = name;
    this.schema = schema;
    this.client = client;
  }

  async waitIndexing(): Promise<void> {
    const command = ["SEARCH.WAITINDEXING", this.name];
    await new ExecCommand<"<OK>">(command as [string, ...string[]]).exec(this.client);
  }

  async describe(): Promise<IndexDescription<TSchema>> {
    const command = ["SEARCH.DESCRIBE", this.name];
    const rawResult = await new ExecCommand<any>(command as [string, ...string[]]).exec(
      this.client
    );
    return deserializeDescribeResponse<TSchema>(rawResult);
  }

  async query<TOpts extends QueryOptions<TSchema>>(
    options?: TOpts
  ): Promise<QueryResult<TSchema, TOpts>[]> {
    const command = buildQueryCommand<TSchema>("SEARCH.QUERY", this.name, options);
    const rawResult = await new ExecCommand<string[]>(command as [string, ...string[]]).exec(
      this.client
    );
    return deserializeQueryResponse<TSchema, TOpts>(rawResult);
  }

  async aggregate<TOpts extends AggregateOptions<TSchema>>(
    options: TOpts
  ): Promise<AggregateResult<TSchema, TOpts>> {
    const command = buildAggregateCommand(this.name, options);
    const rawResult = await new ExecCommand<(string | number)[]>(
      command as [string, ...string[]]
    ).exec(this.client);
    return deserializeAggregateResponse(rawResult, Boolean(options.limit));
  }

  async count({ filter }: { filter: RootQueryFilter<TSchema> }): Promise<{ count: number }> {
    const command = buildQueryCommand<TSchema>("SEARCH.COUNT", this.name, { filter });
    const rawResult = await new ExecCommand<any>(command as [string, ...string[]]).exec(
      this.client
    );
    return { count: parseCountResponse(rawResult) };
  }

  async drop(): Promise<1 | 0> {
    const command = ["SEARCH.DROP", this.name];
    const result = await new ExecCommand<1 | 0>(command as [string, ...string[]]).exec(this.client);
    return result;
  }
}

export async function createIndex<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  client: Requester,
  params: CreateIndexParameters<TSchema>
): Promise<SearchIndex<TSchema>> {
  const { name, schema } = params;
  const createIndexCommand = buildCreateIndexCommand<TSchema>(params);
  await new ExecCommand<string>(createIndexCommand as [string, ...string[]]).exec(client);

  return initIndex(client, { name, schema: schema as TSchema });
}

export function initIndex(
  client: Requester,
  params: Pick<InitIndexParameters<any>, "name">
): SearchIndex<any>;
export function initIndex<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  client: Requester,
  params: InitIndexParameters<TSchema>
): SearchIndex<TSchema>;
export function initIndex<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  client: Requester,
  params: InitIndexParameters<TSchema>
): SearchIndex<TSchema> {
  const { name, schema } = params;
  return new SearchIndex<TSchema>({ name, schema, client });
}

export type InferFilterFromSchema<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  NonNullable<NonNullable<Parameters<SearchIndex<TSchema>["query"]>[0]>["filter"]>;
