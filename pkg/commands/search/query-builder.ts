import type {
  FieldType,
  DetailedField,
  NestedIndexSchema,
  FlatIndexSchema,
  SchemaPaths,
  GetFieldAtPath,
  ExtractFieldType,
} from "./types";

type AvailableOperations<TFields extends string, TParameter> = {
  [P in TFields]: P extends "equals"
    ? { [Q in P]: TParameter } & { [Q in Exclude<TFields, P>]?: never }
    : { [Q in P]: TParameter };
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
  ? AvailableOperations<StringOperation, string>
  : T extends "U64" | "I64" | "F64"
    ? AvailableOperations<NumberOperation, number>
    : T extends "BOOL"
      ? AvailableOperations<BooleanOperation, boolean>
      : T extends "DATE"
        ? AvailableOperations<DateOperation, string | Date>
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

  const formatValue = (v: any): any => {
    if (v instanceof Date) {
      return v.toISOString();
    }
    return v;
  };

  // { name: { equals: "John" } },
  const field = Object.keys(filter)[0]; // name
  const operationObj = filter[field]; // { equals: "John" }
  const operations = Object.keys(operationObj); // ["equals", "lessThan", "lessThanOrEquals", "greaterThan", "greaterThanOrEquals"]
  if (operations.length === 0) {
    throw new Error(`No operations provided for field '${field}'.`);
  }

  if (operations.includes("equals")) {
    const value = operationObj.equals;
    return { [field]: formatValue(value) };
  } else {
    const filter = operations.reduce(
      (acc, operation) => {
        switch (operation) {
          case "lessThan":
            acc.$lt = formatValue(operationObj[operation]);
            break;
          case "lessThanOrEquals":
            acc.$lte = formatValue(operationObj[operation]);
            break;
          case "greaterThan":
            acc.$gt = formatValue(operationObj[operation]);
            break;
          case "greaterThanOrEquals":
            acc.$gte = formatValue(operationObj[operation]);
            break;
          default:
            throw new Error(`Unsupported operation: ${operation}`);
        }
        return acc;
      },
      {} as Record<string, any>
    );
    return { [field]: { $range: filter } };
  }
}

export type QueryOptions<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  /** Maximum number of results to return */
  limit?: number;
  /** Number of results to skip */
  offset?: number;
  /** Return only keys, no content */
  noContent?: boolean;
  /** Sort by field (requires FAST option on field) */
  sortBy?: {
    field: SchemaPaths<TSchema>;
    direction?: "ASC" | "DESC";
  };
  /** Return only specific fields */
  returnFields?: SchemaPaths<TSchema>[];
};

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

  if (options?.returnFields && options.returnFields.length > 0) {
    command.push("RETURN", options.returnFields.length.toString(), ...options.returnFields);
  }

  return command;
}
