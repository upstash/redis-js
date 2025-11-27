import {
  FlatIndexSchema,
  NestedIndexSchema,
  parseQueryResponse,
  parseDescribeResponse,
  parseCountResponse,
  QueryResponse,
  IndexDescription,
} from "./types";
import { flattenSchema } from "./flatten-schema";
import type { Requester } from "../../http";
import { ExecCommand } from "../exec";
import { QueryFilter, QueryOptions, buildQuery, buildQueryCommand } from "./query-builder";
export type { QueryFilter, QueryOptions } from "./query-builder";
export type { IndexDescription, QueryResponse, QueryResult } from "./types";

export type IndexProps<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  | {
      indexName: string;
      schema: TSchema extends NestedIndexSchema ? TSchema : never;
      dataType: "string";
      prefix: string;
      client: Requester;
    }
  | {
      indexName: string;
      schema: TSchema extends FlatIndexSchema ? TSchema : never;
      dataType: "hash";
      prefix: string | string[];
      client: Requester;
    };

export class SearchIndex<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TProps extends IndexProps<TSchema>,
> {
  indexName: TProps["indexName"];
  schema: TSchema;
  dataType: TProps["dataType"];
  prefix: TProps["prefix"];
  client: Requester;

  constructor({ indexName, schema, dataType, prefix, client }: TProps) {
    this.indexName = indexName;
    this.schema = schema;
    this.dataType = dataType;
    this.prefix = prefix;
    this.client = client;
  }

  async create(): Promise<string> {
    const prefixArray = Array.isArray(this.prefix) ? this.prefix : [this.prefix];

    const payload: string[] = [
      this.indexName,
      "ON",
      this.dataType.toUpperCase(),
      "PREFIX",
      prefixArray.length.toString(),
      ...prefixArray,
      "SCHEMA",
    ];

    const fields = flattenSchema(this.schema);

    for (const field of fields) {
      payload.push(field.path, field.type);

      if (field.fast) {
        payload.push("FAST");
      }
      if (field.noTokenize) {
        payload.push("NOTOKENIZE");
      }
      if (field.noStem) {
        payload.push("NOSTEM");
      }
    }

    let command = ["SEARCH.CREATE", ...payload];
    const result = await new ExecCommand<string>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }

  async commit(): Promise<string> {
    let command = ["SEARCH.COMMIT", this.indexName];
    const result = await new ExecCommand<string>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }

  async describe(): Promise<IndexDescription> {
    let command = ["SEARCH.DESCRIBE", this.indexName];
    const rawResult = await new ExecCommand<any>(command as [string, ...string[]]).exec(
      this.client
    );
    return parseDescribeResponse(rawResult);
  }

  async query<TOptions extends QueryOptions<TSchema>>(
    filter: QueryFilter<TSchema>,
    options?: TOptions
  ): Promise<QueryResponse<TSchema, TOptions>> {
    const queryString = buildQuery(filter);
    const command = buildQueryCommand<TSchema>(
      "SEARCH.QUERY",
      this.indexName,
      queryString,
      options
    );
    const rawResult = await new ExecCommand<string[]>(command as [string, ...string[]]).exec(
      this.client
    );

    return parseQueryResponse<TSchema, TOptions>(rawResult, options);
  }

  async count(filter: QueryFilter<TSchema>, options?: QueryOptions<TSchema>): Promise<number> {
    const queryString = buildQuery(filter);
    const command = buildQueryCommand("SEARCH.COUNT", this.indexName, queryString, options);

    const rawResult = await new ExecCommand<any>(command as [string, ...string[]]).exec(
      this.client
    );
    return parseCountResponse(rawResult);
  }

  async delete(): Promise<string> {
    let command = ["SEARCH.DROP", this.indexName];
    const result = await new ExecCommand<string>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }
}

export function createIndex<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  props: IndexProps<TSchema>
) {
  return new SearchIndex<TSchema, IndexProps<TSchema>>(props);
}
