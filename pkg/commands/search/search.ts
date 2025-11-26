import { HashIndexSchema, InferStringSchemaData, PrefixedKey, StringIndexSchema } from "./types";
import { flattenSchema } from "./flatten-schema";
import type { Requester } from "../../http";
import { ExecCommand } from "../exec";

type IndexProps<
  TSchema extends StringIndexSchema | HashIndexSchema = StringIndexSchema | HashIndexSchema,
> =
  | {
      indexName: string;
      schema: TSchema extends StringIndexSchema ? TSchema : never;
      dataType: "string";
      prefix: string;
      client: Requester;
    }
  | {
      indexName: string;
      schema: TSchema extends HashIndexSchema ? TSchema : never;
      dataType: "hash";
      prefix: string | string[];
      client: Requester;
    };

abstract class BaseIndex<
  TSchema extends StringIndexSchema | HashIndexSchema,
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

  async delete(): Promise<string> {
    let command = ["SEARCH.DROP", this.indexName];
    const result = await new ExecCommand<string>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }
}

class HashIndex<
  TSchema extends HashIndexSchema,
  TPrefix extends string | string[],
  TProps extends IndexProps<TSchema> & { dataType: "hash"; prefix: TPrefix },
> extends BaseIndex<TSchema, TProps> {
  async hset(key: PrefixedKey<TPrefix>, data: InferStringSchemaData<TSchema>): Promise<string> {
    const payload: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      payload.push(key);
      payload.push(value.toString());
    }

    let command = ["HSET", key, ...payload];
    console.log(command);
    const result = await new ExecCommand<string>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }
}

class StringIndex<
  TSchema extends StringIndexSchema,
  TPrefix extends string,
  TProps extends IndexProps<TSchema> & { dataType: "string"; prefix: TPrefix },
> extends BaseIndex<TSchema, TProps> {
  async set(key: PrefixedKey<TPrefix>, data: InferStringSchemaData<TSchema>): Promise<string> {
    let command = ["SET", key, JSON.stringify(data)];
    const result = await new ExecCommand<string>(command as [string, ...string[]]).exec(
      this.client
    );
    return result;
  }
}

export function createIndex<TSchema extends HashIndexSchema, TPrefix extends string | string[]>(
  options: IndexProps<TSchema> & { dataType: "hash"; prefix: TPrefix }
): HashIndex<TSchema, TPrefix, IndexProps<TSchema> & { dataType: "hash"; prefix: TPrefix }>;

export function createIndex<TSchema extends StringIndexSchema, TPrefix extends string>(
  options: IndexProps<TSchema> & { dataType: "string"; prefix: TPrefix }
): StringIndex<TSchema, TPrefix, IndexProps<TSchema> & { dataType: "string"; prefix: TPrefix }>;

export function createIndex<TSchema extends StringIndexSchema | HashIndexSchema>(
  options: IndexProps<TSchema>
):
  | HashIndex<
      HashIndexSchema,
      string | string[],
      IndexProps<HashIndexSchema> & { dataType: "hash" }
    >
  | StringIndex<StringIndexSchema, string, IndexProps<StringIndexSchema> & { dataType: "string" }> {
  if (options.dataType === "hash") {
    return new HashIndex(options);
  }
  if (options.dataType === "string") {
    return new StringIndex(options);
  }
  throw new Error("Invalid data type");
}
