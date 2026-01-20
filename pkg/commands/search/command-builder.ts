import { flattenSchema } from "./utils";
import type { CreateIndexParameters } from "./search";
import type { NestedIndexSchema, FlatIndexSchema, QueryOptions } from "./types";

export function buildQueryCommand<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  redisCommand: "SEARCH.QUERY" | "SEARCH.COUNT",
  name: string,
  options?: QueryOptions<TSchema>
): string[] {
  const query = JSON.stringify(options?.filter ?? {});
  const command: string[] = [redisCommand, name, query];

  if (options?.limit !== undefined) {
    command.push("LIMIT", options.limit.toString());
  }

  if (options?.offset !== undefined) {
    command.push("OFFSET", options.offset.toString());
  }

  if (options?.select && Object.keys(options.select).length === 0) {
    command.push("NOCONTENT");
  }

  if (options?.orderBy) {
    command.push("SORTBY");
    for (const [field, direction] of Object.entries(options.orderBy)) {
      command.push(field, direction as "ASC" | "DESC");
    }
  }

  if (options?.highlight) {
    command.push(
      "HIGHLIGHT",
      "FIELDS",
      options.highlight.fields.length.toString(),
      ...options.highlight.fields
    );
    if (options.highlight.preTag && options.highlight.postTag) {
      command.push("TAGS", options.highlight.preTag, options.highlight.postTag);
    }
  }

  if (options?.select && Object.keys(options.select).length > 0) {
    command.push(
      "RETURN",
      Object.keys(options.select).length.toString(),
      ...Object.keys(options.select)
    );
  }

  return command;
}

export function buildCreateIndexCommand<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  params: CreateIndexParameters<TSchema>
): string[] {
  const { name, schema, dataType, prefix, language, skipInitialScan, existsOk } = params;
  const prefixArray = Array.isArray(prefix) ? prefix : [prefix];

  const payload: string[] = [
    name,
    ...(skipInitialScan ? ["SKIPINITIALSCAN"] : []),
    ...(existsOk ? ["EXISTSOK"] : []),
    "ON",
    dataType.toUpperCase(),
    "PREFIX",
    prefixArray.length.toString(),
    ...prefixArray,
    ...(language ? ["LANGUAGE", language] : []),
    "SCHEMA",
  ];

  const fields = flattenSchema(schema);

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
    if (field.from) {
      payload.push("FROM", field.from);
    }
  }

  return ["SEARCH.CREATE", ...payload];
}
