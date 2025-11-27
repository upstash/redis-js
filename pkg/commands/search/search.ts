import { FlatIndexSchema, InferSchemaData, PrefixedKey, NestedIndexSchema } from "./types";
import { flattenSchema } from "./flatten-schema";
import type { Requester } from "../../http";
import { ExecCommand } from "../exec";
import { QueryFilter, QueryOptions, buildQuery, buildQueryCommand } from "./query-builder";
export { s } from "./schema-builder";
export type { QueryFilter, QueryOptions } from "./query-builder";

type IndexProps<
  TSchema extends NestedIndexSchema | FlatIndexSchema = NestedIndexSchema | FlatIndexSchema,
> =
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

abstract class BaseIndex<
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

  async query(filter: QueryFilter<TSchema>, options?: QueryOptions): Promise<string[]> {
    const queryString = buildQuery(filter);
    const command = buildQueryCommand(this.indexName, queryString, options);
    const result = await new ExecCommand<string[]>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }

  async delete(): Promise<string> {
    let command = ["SEARCH.DROP", this.indexName];
    const result = await new ExecCommand<string>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }
}

class HashIndex<
  TSchema extends FlatIndexSchema,
  TPrefix extends string | string[],
  TProps extends IndexProps<TSchema> & { dataType: "hash"; prefix: TPrefix },
> extends BaseIndex<TSchema, TProps> {
  async hset(key: PrefixedKey<TPrefix>, data: InferSchemaData<TSchema>): Promise<string> {
    const payload: string[] = [];

    for (const [key, value] of Object.entries(data) as [
      string,
      string | number | boolean | Date,
    ][]) {
      payload.push(key);
      payload.push(value.toString());
    }

    let command = ["HSET", key, ...payload];
    const result = await new ExecCommand<string>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }
}

class StringIndex<
  TSchema extends NestedIndexSchema,
  TPrefix extends string,
  TProps extends IndexProps<TSchema> & { dataType: "string"; prefix: TPrefix },
> extends BaseIndex<TSchema, TProps> {
  async set(key: PrefixedKey<TPrefix>, data: InferSchemaData<TSchema>): Promise<string> {
    let command = ["SET", key, JSON.stringify(data)];
    const result = await new ExecCommand<string>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }
}

export function createIndex<TSchema extends FlatIndexSchema, TPrefix extends string | string[]>(
  options: IndexProps<TSchema> & { dataType: "hash"; prefix: TPrefix }
): HashIndex<TSchema, TPrefix, IndexProps<TSchema> & { dataType: "hash"; prefix: TPrefix }>;

export function createIndex<TSchema extends NestedIndexSchema, TPrefix extends string>(
  options: IndexProps<TSchema> & { dataType: "string"; prefix: TPrefix }
): StringIndex<TSchema, TPrefix, IndexProps<TSchema> & { dataType: "string"; prefix: TPrefix }>;

export function createIndex<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  options: IndexProps<TSchema>
):
  | HashIndex<
      FlatIndexSchema,
      string | string[],
      IndexProps<FlatIndexSchema> & { dataType: "hash" }
    >
  | StringIndex<NestedIndexSchema, string, IndexProps<NestedIndexSchema> & { dataType: "string" }> {
  if (options.dataType === "hash") {
    return new HashIndex(options);
  }
  if (options.dataType === "string") {
    return new StringIndex(options);
  }
  throw new Error("Invalid data type");
}
