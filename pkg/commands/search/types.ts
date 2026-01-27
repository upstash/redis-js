export const FIELD_TYPES = ["TEXT", "U64", "I64", "F64", "BOOL", "DATE"] as const;
export type FieldType = (typeof FIELD_TYPES)[number];

export type TextField = {
  type: "TEXT";
  noTokenize?: boolean;
  noStem?: boolean;
  from?: string;
};

export type NumericField = {
  type: "U64" | "I64" | "F64";
  fast: true;
  from?: string;
};

export type BoolField = {
  type: "BOOL";
  fast?: boolean;
  from?: string;
};

export type DateField = {
  type: "DATE";
  fast?: boolean;
  from?: string;
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

// Helper type to check if a field has a 'from' property
type HasFrom<T> = T extends { from: string } ? true : false;

// Distributes field inference across unions so that
// InferSchemaData<NestedIndexSchema | FlatIndexSchema> does not collapse to never
type InferSchemaDataField<T> = T extends FieldType
  ? FieldValueType<T>
  : T extends DetailedField
    ? FieldValueType<ExtractFieldType<T>>
    : T extends NestedIndexSchema
      ? InferSchemaData<T>
      : unknown;

type IsDefaultSchema<T> = [T] extends [NestedIndexSchema | FlatIndexSchema]
  ? [NestedIndexSchema | FlatIndexSchema] extends [T]
    ? true
    : false
  : false;

type AsAnyIfUnknown<T> = unknown extends T ? any : T;

export type InferSchemaData<TSchema> =
  IsDefaultSchema<TSchema> extends true
    ? any
    : {
        [K in keyof TSchema as TSchema[K] extends DetailedField
          ? HasFrom<TSchema[K]> extends true
            ? never
            : K
          : K]: AsAnyIfUnknown<InferSchemaDataField<TSchema[K]>>;
      };

// Query Options Types
// These are the options that can be used for the query command
export type QueryOptions<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  filter?: RootQueryFilter<TSchema>;
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

/**
 * Converts dot notation paths to nested object structure type
 * e.g. "content.title" | "content.author" becomes { content: { title: ..., author: ... } }
 */
type PathToNestedObject<
  TSchema,
  Path extends string,
  Value,
> = Path extends `${infer First}.${infer Rest}`
  ? { [K in First]: PathToNestedObject<TSchema, Rest, Value> }
  : { [K in Path]: Value };

/**
 * Merges intersection of objects into a single object type with proper nesting
 */
type DeepMerge<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object ? DeepMerge<T[K]> : T[K];
    }
  : T;

/**
 * Build nested result type from selected paths
 */
type BuildNestedResult<TSchema, TFields> =
  IsDefaultSchema<TSchema> extends true
    ? DeepMerge<
        UnionToIntersection<
          {
            [Path in keyof TFields & string]: PathToNestedObject<any, Path, any>;
          }[keyof TFields & string]
        >
      >
    : DeepMerge<
        UnionToIntersection<
          {
            [Path in keyof TFields & SchemaPaths<TSchema>]: PathToNestedObject<
              TSchema,
              Path & string,
              AsAnyIfUnknown<GetFieldValueType<TSchema, Path & string>>
            >;
          }[keyof TFields & SchemaPaths<TSchema>]
        >
      >;

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type QueryResult<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TOptions extends QueryOptions<TSchema> | undefined = undefined,
> = TOptions extends { select: infer TFields }
  ? // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {} extends TFields
    ? { key: string; score: number }
    : {
        key: string;
        score: number;
        data: BuildNestedResult<TSchema, TFields>;
      }
  : {
      key: string;
      score: number;
      data: InferSchemaData<TSchema>;
    };

export type PublicQueryResult<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TSelectFields extends SchemaPaths<TSchema>[] | undefined = undefined,
> = QueryResult<
  TSchema,
  TSelectFields extends SchemaPaths<TSchema>[]
    ? {
        select: { [K in TSelectFields[number]]: true };
      }
    : undefined
>;

// Query Filter Types
// These are the operations that can be used for each field type
type StringOperationMap<T extends string> = {
  $eq: T;
  $ne: T;
  $in: T[];
  $fuzzy: T | { value: T; distance?: number; transpositionCostOne?: boolean };
  $phrase:
    | T
    | { value: T }
    | { value: T; slop: number; prefix?: never }
    | { value: T; prefix: boolean; slop?: never };
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
  $gt: T;
  $gte: T;
  $lte: T;
  $lt: T;
};

// Create union types for each field type
type StringOperations = {
  [K in keyof StringOperationMap<string>]: { [P in K]: StringOperationMap<string>[K] } & {
    $boost?: number;
  };
}[keyof StringOperationMap<string>];

type NumberOperations = {
  [K in keyof NumberOperationMap<number>]: { [P in K]: NumberOperationMap<number>[K] } & {
    $boost?: number;
  };
}[keyof NumberOperationMap<number>];

type BooleanOperations = {
  [K in keyof BooleanOperationMap<boolean>]: { [P in K]: BooleanOperationMap<boolean>[K] } & {
    $boost?: number;
  };
}[keyof BooleanOperationMap<boolean>];

type DateOperations = {
  [K in keyof DateOperationMap<string | Date>]: { [P in K]: DateOperationMap<string | Date>[K] } & {
    $boost?: number;
  };
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
      ? OperationsForFieldType<ExtractFieldType<Field>> | FieldValueType<ExtractFieldType<Field>>
      : never
    : never;

// Create a type for a query leaf (only field paths, no boolean operators)
type QueryLeaf<TSchema> = {
  // allowed schema paths
  [K in SchemaPaths<TSchema>]?: PathOperations<TSchema, K>;
} & {
  $and?: never;
  $or?: never;
  $must?: never;
  $should?: never;
  $mustNot?: never;
  $boost?: number;
};

type BoolBase<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  [P in SchemaPaths<TSchema>]?: PathOperations<TSchema, P>;
};

// $and: all conditions must match
type AndNode<TSchema extends NestedIndexSchema | FlatIndexSchema> = BoolBase<TSchema> & {
  $and: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $boost?: number;
  $or?: never;
  $must?: never;
  $should?: never;
  $mustNot?: never;
};

// $or: at least one condition must match
type OrNode<TSchema extends NestedIndexSchema | FlatIndexSchema> = BoolBase<TSchema> & {
  $or: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $boost?: number;
  $and?: never;
  $must?: never;
  $should?: never;
  $mustNot?: never;
};

// $must only
type MustNode<TSchema extends NestedIndexSchema | FlatIndexSchema> = BoolBase<TSchema> & {
  $must: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $boost?: number;
  $and?: never;
  $or?: never;
  $should?: never;
  $mustNot?: never;
};

// $should only
type ShouldNode<TSchema extends NestedIndexSchema | FlatIndexSchema> = BoolBase<TSchema> & {
  $should: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $boost?: number;
  $and?: never;
  $or?: never;
  $must?: never;
  $mustNot?: never;
};

// $must + $should combined
type MustShouldNode<TSchema extends NestedIndexSchema | FlatIndexSchema> = BoolBase<TSchema> & {
  $must: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $should: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $and?: never;
  $or?: never;
};

// $mustNot only
type NotNode<TSchema extends NestedIndexSchema | FlatIndexSchema> = BoolBase<TSchema> & {
  $mustNot: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $boost?: number;
  $and?: never;
  $or?: never;
  $must?: never;
  $should?: never;
};

type AndNotNode<TSchema extends NestedIndexSchema | FlatIndexSchema> = BoolBase<TSchema> & {
  $and: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $mustNot: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $boost?: number;
  $or?: never;
  $must?: never;
  $should?: never;
};

type OrNotNode<TSchema extends NestedIndexSchema | FlatIndexSchema> = BoolBase<TSchema> & {
  $or: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $mustNot: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $boost?: number;
  $and?: never;
  $must?: never;
  $should?: never;
};

// $should + $mustNot combined
type ShouldNotNode<TSchema extends NestedIndexSchema | FlatIndexSchema> = BoolBase<TSchema> & {
  $should: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $mustNot: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $boost?: number;
  $and?: never;
  $or?: never;
  $must?: never;
};

type MustNotNode<TSchema extends NestedIndexSchema | FlatIndexSchema> = BoolBase<TSchema> & {
  $must: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $mustNot: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $boost?: number;
  $and?: never;
  $or?: never;
  $should?: never;
};

// Full boolean node: $must + $should + $mustNot
type BoolNode<TSchema extends NestedIndexSchema | FlatIndexSchema> = BoolBase<TSchema> & {
  $must: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $should: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $mustNot: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $boost?: number;
  $and?: never;
  $or?: never;
};

// Create a type for a query filter
export type QueryFilter<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  | QueryLeaf<TSchema>
  | AndNode<TSchema>
  | OrNode<TSchema>
  | MustNode<TSchema>
  | ShouldNode<TSchema>
  | MustShouldNode<TSchema>
  | NotNode<TSchema>
  | AndNotNode<TSchema>
  | OrNotNode<TSchema>
  | ShouldNotNode<TSchema>
  | MustNotNode<TSchema>
  | BoolNode<TSchema>;

// Create a type for root-level queries (restricts $or from mixing with fields)
export type RootQueryFilter<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  | QueryLeaf<TSchema>
  | AndNode<TSchema>
  | RootOrNode<TSchema>
  | MustNode<TSchema>
  | ShouldNode<TSchema>
  | MustShouldNode<TSchema>
  | AndNotNode<TSchema>
  | ShouldNotNode<TSchema>
  | BoolNode<TSchema>;

// Restricted version of OrNode that doesn't allow field operations at root level
type RootOrNode<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  [P in SchemaPaths<TSchema>]?: never; // No field operations at root level with $or
} & {
  $or: QueryFilter<TSchema> | QueryFilter<TSchema>[];
  $boost?: number;
  $and?: never;
  $must?: never;
  $should?: never;
  $mustNot?: never;
};

export type DescribeFieldInfo = {
  type: FieldType;
  noTokenize?: boolean;
  noStem?: boolean;
  fast?: boolean;
};

export type IndexDescription<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  name: string;
  dataType: "hash" | "string" | "json";
  prefixes: string[];
  language?: Language;
  schema: Record<SchemaPaths<TSchema>, DescribeFieldInfo>;
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
