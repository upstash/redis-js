import { flattenSchema } from "./utils";
import { CreateSearchIndexProps } from "./search";
import type { NestedIndexSchema, FlatIndexSchema, QueryOptions } from "./types";

export function buildQueryCommand<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  redisCommand: "SEARCH.QUERY" | "SEARCH.COUNT",
  indexName: string,
  query: string,
  options?: QueryOptions<TSchema>
): string[] {
  const command: string[] = [redisCommand, indexName, query];

  if (options?.limit !== undefined) {
    command.push("LIMIT", options.limit.toString());
  }

  if (options?.offset !== undefined) {
    command.push("OFFSET", options.offset.toString());
  }

  if (options?.noContent) {
    command.push("NOCONTENT");
  }

  if (options?.sortBy) {
    command.push("SORTBY", options.sortBy.field);
    if (options.sortBy.direction) {
      command.push(options.sortBy.direction);
    }
  }

  if (options && "highlight" in options && options.highlight) {
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

  if (
    options &&
    "returnFields" in options &&
    options.returnFields &&
    options.returnFields.length > 0
  ) {
    command.push("RETURN", options.returnFields.length.toString(), ...options.returnFields);
  }

  return command;
}

export function buildCreateIndexCommand<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  props: CreateSearchIndexProps<TSchema>
): string[] {
  const { indexName, schema, dataType, prefix, language } = props;
  const prefixArray = Array.isArray(prefix) ? prefix : [prefix];

  const payload: string[] = [
    indexName,
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
  }

  return ["SEARCH.CREATE", ...payload];
}
