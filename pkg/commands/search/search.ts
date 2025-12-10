import type {
  FlatIndexSchema,
  NestedIndexSchema,
  QueryOptions,
  QueryFilter,
  IndexDescription,
  QueryResponse,
} from "./types";
import type { Requester } from "../../http";
import { ExecCommand } from "../exec";
import { buildCreateIndexCommand, buildQueryCommand } from "./command-builder";
import { parseCountResponse, parseDescribeResponse, parseQueryResponse } from "./utils";

export type CreateSearchIndexProps<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  indexName: string;
  prefix: string | string[];
  language?: "english" | "turkish";
  client: Requester;
} & (
  | { dataType: "string"; schema: TSchema extends NestedIndexSchema ? TSchema : never }
  | { dataType: "hash"; schema: TSchema extends FlatIndexSchema ? TSchema : never }
);

export type SearchIndexProps<TSchema extends NestedIndexSchema | FlatIndexSchema> = Pick<
  CreateSearchIndexProps<TSchema>,
  "indexName" | "client"
> & { schema?: CreateSearchIndexProps<TSchema>["schema"] };

export class SearchIndex<TSchema extends NestedIndexSchema | FlatIndexSchema> {
  readonly indexName: SearchIndexProps<TSchema>["indexName"];
  readonly schema?: TSchema;
  private client: Requester;

  constructor({ indexName, schema, client }: SearchIndexProps<TSchema>) {
    this.indexName = indexName;
    this.schema = schema;
    this.client = client;
  }

  async waitIndexing(): Promise<string> {
    const command = ["SEARCH.COMMIT", this.indexName];
    const result = await new ExecCommand<string>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }

  async describe(): Promise<IndexDescription> {
    const command = ["SEARCH.DESCRIBE", this.indexName];
    const rawResult = await new ExecCommand<any>(command as [string, ...string[]]).exec(
      this.client
    );
    return parseDescribeResponse(rawResult);
  }

  async query(
    options: QueryOptions<TSchema>
  ): Promise<QueryResponse<TSchema, QueryOptions<TSchema>>> {
    const command = buildQueryCommand<TSchema>("SEARCH.QUERY", this.indexName, options);
    const rawResult = await new ExecCommand<string[]>(command as [string, ...string[]]).exec(
      this.client
    );
    return parseQueryResponse<TSchema, QueryOptions<TSchema>>(rawResult, options);
  }

  async count(filter: QueryFilter<TSchema>): Promise<number> {
    const command = buildQueryCommand("SEARCH.COUNT", this.indexName, { filter });
    const rawResult = await new ExecCommand<any>(command as [string, ...string[]]).exec(
      this.client
    );
    return parseCountResponse(rawResult);
  }

  async drop(): Promise<string> {
    const command = ["SEARCH.DROP", this.indexName];
    const result = await new ExecCommand<string>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }
}

export async function createSearchIndex<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  props: CreateSearchIndexProps<TSchema>
) {
  const { indexName, schema, client } = props;
  const createIndexCommand = buildCreateIndexCommand<TSchema>(props);
  await new ExecCommand<string>(createIndexCommand as [string, ...string[]]).exec(client);
  return getSearchIndex({ indexName, schema, client });
}

export function getSearchIndex<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  props: SearchIndexProps<TSchema>
) {
  return new SearchIndex<TSchema>(props);
}
