import { flattenSchema } from "./utils";
import type { CreateIndexParameters } from "./search";
import type { NestedIndexSchema, FlatIndexSchema, QueryOptions, ScoreBy } from "./types";

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

  if (options) {
    if ("orderBy" in options && options.orderBy) {
      command.push("ORDERBY");
      for (const [field, direction] of Object.entries(options.orderBy)) {
        command.push(field, direction as "ASC" | "DESC");
      }
    } else if ("scoreFunc" in options && options.scoreFunc) {
      command.push("SCOREFUNC", ...buildScoreFunc(options.scoreFunc));
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
      "SELECT",
      Object.keys(options.select).length.toString(),
      ...Object.keys(options.select)
    );
  }

  return command;
}

function buildScoreFunc(scoreBy: ScoreBy<string>): string[] {
  const result: string[] = [];

  if (typeof scoreBy === "string") {
    result.push("FIELDVALUE", scoreBy);
  } else if ("fields" in scoreBy) {
    if (scoreBy.combineMode) {
      result.push("COMBINEMODE", scoreBy.combineMode.toUpperCase());
    }
    if (scoreBy.scoreMode) {
      result.push("SCOREMODE", scoreBy.scoreMode.toUpperCase());
    }

    for (const field of scoreBy.fields) {
      result.push(...buildScoreFuncField(field));
    }
  } else {
    result.push(...buildScoreFuncField(scoreBy));
  }
  return result;
}

function buildScoreFuncField(
  field:
    | string
    | { field: string; modifier?: string; factor?: number; missing?: number; scoreMode?: string }
): string[] {
  const result: string[] = [];

  if (typeof field === "string") {
    result.push("FIELDVALUE", field);
  } else {
    if (field.scoreMode) {
      result.push("SCOREMODE", field.scoreMode.toUpperCase());
    }
    result.push("FIELDVALUE", field.field);
    if (field.modifier) {
      result.push("MODIFIER", field.modifier.toUpperCase());
    }
    if (field.factor !== undefined) {
      result.push("FACTOR", field.factor.toString());
    }
    if (field.missing !== undefined) {
      result.push("MISSING", field.missing.toString());
    }
  }
  return result;
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

export function buildAggregateCommand(name: string, options: any): string[] {
  const query = JSON.stringify(options?.filter ?? {});
  const aggregations = JSON.stringify(options.aggregations);
  return ["SEARCH.AGGREGATE", name, query, aggregations];
}
