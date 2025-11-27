import type {
  FieldType,
  DetailedField,
  NestedIndexSchema,
  FlatIndexSchema,
  SchemaPaths,
} from "./types";

type ExtractFieldType<T> = T extends FieldType
  ? T
  : T extends { type: infer U }
    ? U extends FieldType
      ? U
      : never
    : never;

type GetFieldAtPath<TSchema, Path extends string> = Path extends `${infer First}.${infer Rest}`
  ? First extends keyof TSchema
    ? GetFieldAtPath<TSchema[First], Rest>
    : never
  : Path extends keyof TSchema
    ? TSchema[Path]
    : never;

type MutuallyExclusives<TFields extends string, TParameter> = {
  [P in TFields]: { [Q in P]: TParameter } & {
    [R in Exclude<TFields, P>]?: never;
  };
}[TFields];

type StringOperation = "equals";
type NumberOperation =
  | "equals"
  | "lessThan"
  | "lessThanOrEquals"
  | "greaterThan"
  | "greaterThanOrEquals";
type BooleanOperation = "equals";
type DateOperation =
  | "equals"
  | "lessThan"
  | "lessThanOrEquals"
  | "greaterThan"
  | "greaterThanOrEquals";

type OperationsForFieldType<T extends FieldType> = T extends "TEXT"
  ? MutuallyExclusives<StringOperation, string>
  : T extends "U64" | "I64" | "F64"
    ? MutuallyExclusives<NumberOperation, number>
    : T extends "BOOL"
      ? MutuallyExclusives<BooleanOperation, boolean>
      : T extends "DATE"
        ? MutuallyExclusives<DateOperation, string | Date>
        : never;

type PathOperations<TSchema, TPath extends string> =
  GetFieldAtPath<TSchema, TPath> extends infer Field
    ? Field extends FieldType | DetailedField
      ? OperationsForFieldType<ExtractFieldType<Field>>
      : never
    : never;

type QueryLeaf<TSchema> = {
  [Path in SchemaPaths<TSchema>]: {
    [K in Path]: PathOperations<TSchema, Path>;
  } & {
    [K in Exclude<SchemaPaths<TSchema>, Path>]?: never;
  };
}[SchemaPaths<TSchema>];

export type QueryFilter<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  | QueryLeaf<TSchema>
  | { OR: QueryFilter<TSchema>[] }
  | { AND: QueryFilter<TSchema>[] };

export function buildQuery<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  filter: QueryFilter<TSchema>
): string {
  const queryObj = buildQueryObject(filter);
  return JSON.stringify(queryObj);
}

function buildQueryObject(filter: any) {
  // OR: [{ name: { equals: "John" } }, { name: { equals: "Jane" } }],
  if ("OR" in filter) {
    return { $or: filter.OR.map((f: any) => buildQueryObject(f)) };
  }

  if ("AND" in filter) {
    return { $and: filter.AND.map((f: any) => buildQueryObject(f)) };
  }

  // { name: { equals: "John" } },
  const field = Object.keys(filter)[0]; // name
  const operationObj = filter[field]; // { equals: "John" }
  const operation = Object.keys(operationObj)[0]; // equals
  const value = operationObj[operation]; // "John"

  if (value === undefined) {
    throw new Error(`Value for operation '${operation}' on field '${field}' cannot be undefined.`);
  }

  const formatValue = (v: any): any => {
    if (v instanceof Date) {
      return v.toISOString();
    }
    return v;
  };

  switch (operation) {
    case "equals":
      return { [field]: formatValue(value) };

    case "lessThan":
      return { [field]: { $range: { $lt: formatValue(value) } } };

    case "lessThanOrEquals":
      return { [field]: { $range: { $lte: formatValue(value) } } };

    case "greaterThan":
      return { [field]: { $range: { $gt: formatValue(value) } } };

    case "greaterThanOrEquals":
      return { [field]: { $range: { $gte: formatValue(value) } } };

    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
}

export type QueryOptions = {
  /** Maximum number of results to return */
  limit?: number;
  /** Number of results to skip */
  offset?: number;
  /** Return only keys, no content */
  noContent?: boolean;
  /** Sort by field (requires FAST option on field) */
  sortBy?: {
    field: string;
    direction?: "ASC" | "DESC";
  };
  /** Return only specific fields */
  returnFields?: string[];
};

export function buildQueryCommand(
  indexName: string,
  query: string,
  options?: QueryOptions
): string[] {
  const command: string[] = ["SEARCH.QUERY", indexName, query];

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

  if (options?.returnFields && options.returnFields.length > 0) {
    command.push("RETURN", options.returnFields.length.toString(), ...options.returnFields);
  }

  return command;
}
