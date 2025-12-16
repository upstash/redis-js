export const FIELD_TYPES = ["TEXT", "U64", "I64", "F64", "BOOL", "DATE"] as const;
export type FieldType = (typeof FIELD_TYPES)[number];

export type TextField = {
  type: "TEXT";
  noTokenize?: boolean;
  noStem?: boolean;
};

export type NumericField = {
  type: "U64" | "I64" | "F64";
  fast: true;
};

export type BoolField = {
  type: "BOOL";
  fast?: boolean;
};

export type DateField = {
  type: "DATE";
  fast?: boolean;
};

export type DetailedField = TextField | NumericField | BoolField | DateField;
export type NestedIndexSchema = {
  [key: string]: FieldType | DetailedField | NestedIndexSchema;
};

export type FlatIndexSchema = {
  [key: string]: FieldType | DetailedField;
};

export type SchemaPaths<T, Prefix extends string = ""> = {
  [K in keyof T]: K extends string
    ? T[K] extends FieldType | DetailedField
      ? Prefix extends ""
        ? K
        : `${Prefix}${K}`
      : T[K] extends object
        ? SchemaPaths<T[K], `${Prefix}${K}.`>
        : never
    : never;
}[keyof T];

export type ExtractFieldType<T> = T extends FieldType
  ? T
  : T extends { type: infer U }
    ? U extends FieldType
      ? U
      : never
    : never;

export type GetFieldAtPath<
  TSchema,
  Path extends string,
> = Path extends `${infer First}.${infer Rest}`
  ? First extends keyof TSchema
    ? GetFieldAtPath<TSchema[First], Rest>
    : never
  : Path extends keyof TSchema
    ? TSchema[Path]
    : never;

type FieldValueType<T extends FieldType> = T extends "TEXT"
  ? string
  : T extends "U64" | "I64" | "F64"
    ? number
    : T extends "BOOL"
      ? boolean
      : T extends "DATE"
        ? string
        : never;

type GetFieldValueType<TSchema, Path extends string> =
  GetFieldAtPath<TSchema, Path> extends infer Field
    ? Field extends FieldType | DetailedField
      ? FieldValueType<ExtractFieldType<Field>>
      : never
    : never;

export type InferSchemaData<TSchema> = {
  [K in keyof TSchema]: TSchema[K] extends FieldType
    ? FieldValueType<TSchema[K]>
    : TSchema[K] extends DetailedField
      ? FieldValueType<ExtractFieldType<TSchema[K]>>
      : TSchema[K] extends NestedIndexSchema
        ? InferSchemaData<TSchema[K]>
        : never;
};

// Query Options Types
// These are the options that can be used for the query command
export type QueryOptions<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  filter: QueryFilter<TSchema>;
  /** Maximum number of results to return */
  limit?: number;
  /** Number of results to skip */
  offset?: number;
  /** Sort by field (requires FAST option on field) */
  orderBy?: {
    [K in SchemaPaths<TSchema>]: { [P in K]: "ASC" | "DESC" };
  }[SchemaPaths<TSchema>];
  select?: Partial<{ [K in SchemaPaths<TSchema>]: true }>; // {}
  highlight?: {
    fields: SchemaPaths<TSchema>[];
    preTag?: string;
    postTag?: string;
  };
};

export type FieldValuePair<TSchema, TField extends string> = TField extends "$"
  ? { $: InferSchemaData<TSchema> }
  : TField extends SchemaPaths<TSchema>
    ? { [K in TField]: GetFieldValueType<TSchema, TField> }
    : never;

// Helper to extract the fields array element type from QueryResult
export type QueryResultFields<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TOptions extends QueryOptions<TSchema> | undefined = undefined,
> = TOptions extends { select: infer TFields }
  ? {} extends TFields
    ? never
    : FieldValuePair<TSchema, keyof TFields & SchemaPaths<TSchema>>
  : FieldValuePair<TSchema, SchemaPaths<TSchema> | "$">;

export type QueryResult<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TOptions extends QueryOptions<TSchema> | undefined = undefined,
> = TOptions extends { select: infer TFields }
  ? {} extends TFields
    ? { key: string; score: string }
    : {
        key: string;
        score: string;
        fields: Array<FieldValuePair<TSchema, keyof TFields & SchemaPaths<TSchema>>>;
      }
  : {
      key: string;
      score: string;
      fields: Array<FieldValuePair<TSchema, SchemaPaths<TSchema> | "$">>;
    };

// Query Filter Types
// These are the operations that can be used for each field type
type StringOperationMap<T extends string> = {
  $eq: T;
  $ne: T;
  $in: T[];
  $fuzzy: T | { value: T; distance?: number; transpositionCostOne?: boolean };
  $phrase: T;
  $regex: T;
};

type NumberOperationMap<T extends number> = {
  $eq: T;
  $ne: T;
  $in: T[];
  $gt: T;
  $gte: T;
  $lt: T;
  $lte: T;
};

type BooleanOperationMap<T extends boolean> = {
  $eq: T;
  $ne: T;
  $in: T[];
};

type DateOperationMap<T extends string | Date> = {
  $eq: T;
  $ne: T;
  $in: T[];
};

// Create union types for each field type
type StringOperations = {
  [K in keyof StringOperationMap<string>]: { [P in K]: StringOperationMap<string>[K] };
}[keyof StringOperationMap<string>];

type NumberOperations = {
  [K in keyof NumberOperationMap<number>]: { [P in K]: NumberOperationMap<number>[K] };
}[keyof NumberOperationMap<number>];

type BooleanOperations = {
  [K in keyof BooleanOperationMap<boolean>]: { [P in K]: BooleanOperationMap<boolean>[K] };
}[keyof BooleanOperationMap<boolean>];

type DateOperations = {
  [K in keyof DateOperationMap<string | Date>]: { [P in K]: DateOperationMap<string | Date>[K] };
}[keyof DateOperationMap<string | Date>];

// Create a union type for all operations for a given field type
type OperationsForFieldType<T extends FieldType> = T extends "TEXT"
  ? StringOperations
  : T extends "U64" | "I64" | "F64"
    ? NumberOperations
    : T extends "BOOL"
      ? BooleanOperations
      : T extends "DATE"
        ? DateOperations
        : never;

// Create a union type for all operations for a given path
type PathOperations<TSchema, TPath extends string> =
  GetFieldAtPath<TSchema, TPath> extends infer Field
    ? Field extends FieldType | DetailedField
      ? OperationsForFieldType<ExtractFieldType<Field>>
      : never
    : never;

// Create a type for a query leaf
type QueryLeaf<TSchema> = {
  [Path in SchemaPaths<TSchema>]: {
    [K in Path]: PathOperations<TSchema, Path>;
  };
}[SchemaPaths<TSchema>];

// Create a type for a query filter
export type QueryFilter<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  | QueryLeaf<TSchema>
  | { $must: QueryFilter<TSchema> }
  | { $should: QueryFilter<TSchema> }
  | { $not: QueryFilter<TSchema> }
  | { $and: QueryFilter<TSchema> }
  | { $or: QueryFilter<TSchema> }
  | { $boost: { query: QueryFilter<TSchema>; value: number } };

export type IndexDescription = {
  indexName: string;
  dataType: "hash" | "string";
  prefixes: string[];
  language?: string;
  schema: FlatIndexSchema;
};

export type Language =
  | "english"
  | "arabic"
  | "danish"
  | "dutch"
  | "finnish"
  | "french"
  | "german"
  | "greek"
  | "hungarian"
  | "italian"
  | "norwegian"
  | "portuguese"
  | "romanian"
  | "russian"
  | "spanish"
  | "swedish"
  | "tamil"
  | "turkish";
