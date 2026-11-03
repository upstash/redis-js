export const FIELD_TYPES = [
  "TEXT",
  "U64",
  "I64",
  "F64",
  "BOOL",
  "DATE",
  "KEYWORD",
  "FACET",
  "HYBRID",
] as const;
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

export type KeywordField = {
  type: "KEYWORD";
};

export type FacetField = {
  type: "FACET";
};

/**
 * A TEXT field that also stores a vector embedding, so it can be searched by meaning with `$ann`.
 *
 * @see https://upstash.com/docs/redis/search/hybrid-search
 */
export type HybridField = {
  type: "HYBRID";
  noStem?: boolean;
  from?: string;
};

export type DetailedField =
  | TextField
  | HybridField
  | NumericField
  | BoolField
  | DateField
  | KeywordField
  | FacetField;
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

type FieldValueType<T extends FieldType> = T extends "TEXT" | "HYBRID"
  ? string
  : T extends "U64" | "I64" | "F64"
    ? number
    : T extends "BOOL"
      ? boolean
      : T extends "DATE"
        ? string
        : T extends "KEYWORD"
          ? string
          : T extends "FACET"
            ? string
            : never;

type GetFieldValueType<TSchema, Path extends string> =
  GetFieldAtPath<TSchema, Path> extends infer Field
    ? Field extends FieldType | DetailedField
      ? FieldValueType<ExtractFieldType<Field>>
      : never
    : never;

/** Paths of fields whose type is one of `TTypes`. */
export type PathsOfType<TSchema, TTypes extends FieldType> = {
  [P in SchemaPaths<TSchema>]: ExtractFieldType<GetFieldAtPath<TSchema, P>> extends TTypes
    ? P
    : never;
}[SchemaPaths<TSchema>];

/**
 * Paths of fields of `TTypes` that sort, score and aggregate. These need to be `FAST`: numeric
 * and KEYWORD fields always are, and BOOL and DATE fields are when declared with `.fast()`.
 */
type FastPaths<TSchema, TTypes extends FieldType> = {
  [P in SchemaPaths<TSchema>]: GetFieldAtPath<TSchema, P> extends infer TField
    ? ExtractFieldType<TField> extends TTypes
      ? ExtractFieldType<TField> extends NumericType | "KEYWORD"
        ? P
        : TField extends { fast: true }
          ? P
          : never
      : never
    : never;
}[SchemaPaths<TSchema>];

type NumericType = "U64" | "I64" | "F64";

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
// Short-circuit to permissive types when schema is the default (any) to avoid
// excessively deep type instantiation.
export type QueryOptions<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  IsDefaultSchema<TSchema> extends true
    ? {
        filter?: Record<string, any>;
        limit?: number;
        offset?: number;
        select?: Record<string, true>;
        highlight?: {
          fields: readonly string[];
          preTag?: string;
          postTag?: string;
        };
        orderBy?: Record<string, "ASC" | "DESC">;
        scoreFunc?: ScoreBy<string>;
      }
    : {
        /** Maximum number of results to return */
        limit?: number;
        /** Number of results to skip */
        offset?: number;
        select?: Partial<{ [K in SchemaPaths<TSchema>]: true }>;
      } & (
        | ({
            filter?: QueryFilter<TSchema> | StandardRetriever<TSchema>;
            highlight?: HighlightOption<TSchema>;
          } & OrderOrScoreOption<TSchema>)
        // ORDERBY, SCOREFUNC and HIGHLIGHT do not work with $ann at the root
        | { filter: AnnRetriever<TSchema>; orderBy?: never; scoreFunc?: never; highlight?: never }
        // ORDERBY does not work with $rrf
        | {
            filter: RrfRetriever<TSchema>;
            orderBy?: never;
            scoreFunc?: ScoreBy<ScorePaths<TSchema>>;
            highlight?: HighlightOption<TSchema>;
          }
        // A filter typed as any query or retriever, such as `InferFilterFromSchema`
        | {
            filter?: QueryFilter<TSchema> | Retriever<TSchema>;
            orderBy?: never;
            scoreFunc?: never;
            highlight?: never;
          }
      );

type CombineMode = "multiply" | "sum";
type ScoreMode = "multiply" | "sum" | "replace";
type ScoreModifier =
  | "none"
  | "log"
  | "log1p"
  | "log2p"
  | "ln"
  | "ln1p"
  | "ln2p"
  | "square"
  | "sqrt"
  | "reciprocal";

export type ScoreBy<TSchemaPaths extends string> =
  | ScoreByField<false, TSchemaPaths>
  | {
      fields: readonly ScoreByField<true, TSchemaPaths>[];
      combineMode?: CombineMode;
      scoreMode?: ScoreMode;
    };

type ScoreByField<TMultiple extends boolean, TSchemaPaths extends string> =
  | {
      field: TSchemaPaths;
      modifier?: ScoreModifier;
      factor?: number;
      missing?: number;
      scoreMode?: TMultiple extends true ? never : ScoreMode;
    }
  | TSchemaPaths;

/** Fields that results can be sorted by: `FAST` numeric, BOOL and DATE fields. */
type OrderPaths<TSchema> = FastPaths<TSchema, NumericType | "BOOL" | "DATE">;

/** Fields that score functions can read: `FAST` numeric fields. */
type ScorePaths<TSchema> = FastPaths<TSchema, NumericType>;

/** Sorts by one field. */
type OrderByOption<TSchema> = {
  [P in OrderPaths<TSchema>]: { [K in P]: "ASC" | "DESC" } & {
    [K in Exclude<OrderPaths<TSchema>, P>]?: never;
  };
}[OrderPaths<TSchema>];

// `orderBy` replaces scoring, so a `scoreFunc` next to it would be ignored
type OrderOrScoreOption<TSchema> =
  | { orderBy?: OrderByOption<TSchema>; scoreFunc?: never }
  | { scoreFunc?: ScoreBy<ScorePaths<TSchema>>; orderBy?: never };

type HighlightOption<TSchema> = {
  /** TEXT, HYBRID and KEYWORD fields to highlight */
  fields: readonly PathsOfType<TSchema, "TEXT" | "HYBRID" | "KEYWORD">[];
} & (
  | {
      /** Set both tags, or neither for the default `<em>` and `</em>` */
      preTag: string;
      postTag: string;
    }
  | { preTag?: never; postTag?: never }
);

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
  TOptions extends { select?: unknown } | undefined = undefined,
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
// The operators of each field type. A field takes one or more of them in one object.
type StringOperationMap<T extends string> = {
  $eq: T;
  $in: readonly T[];
  $fuzzy: T | { value: T; distance?: 0 | 1 | 2; transpositionCostOne?: boolean; prefix?: boolean };
  $phrase:
    | T
    | { value: T; slop?: number; prefix?: never }
    | { value: T; prefix?: boolean; slop?: never };
  $regex: T;
  $smart: T;
};

type RangeOperationMap<T> = {
  $eq: T;
  $in: readonly T[];
  $gt: T;
  $gte: T;
  $lt: T;
  $lte: T;
};

type EqualityOperationMap<T> = {
  $eq: T;
  $in: readonly T[];
};

/** At least one operator of `TMap`, the others optional, and an optional `$boost`. */
type Operations<TMap> = {
  [K in keyof TMap]: { [P in K]: TMap[P] } & { [P in Exclude<keyof TMap, K>]?: TMap[P] };
}[keyof TMap] & { $boost?: number };

/** A range has at most one lower bound and one upper bound. */
type OneBoundPerSide = ({ $gt?: never } | { $gte?: never }) & ({ $lt?: never } | { $lte?: never });

type StringOperations = Operations<StringOperationMap<string>>;
type NumberOperations = Operations<RangeOperationMap<number>> & OneBoundPerSide;
type BooleanOperations = Operations<EqualityOperationMap<boolean>>;
type DateOperations = Operations<RangeOperationMap<string | Date>> & OneBoundPerSide;
type KeywordOperations = Operations<RangeOperationMap<string>> & OneBoundPerSide;
type FacetOperations = Operations<EqualityOperationMap<string>>;

// Create a union type for all operations for a given field type
type OperationsForFieldType<T extends FieldType> = T extends "TEXT" | "HYBRID"
  ? StringOperations
  : T extends NumericType
    ? NumberOperations
    : T extends "BOOL"
      ? BooleanOperations
      : T extends "DATE"
        ? DateOperations
        : T extends "KEYWORD"
          ? KeywordOperations
          : T extends "FACET"
            ? FacetOperations
            : never;

type PathOperations<TSchema, TPath extends string> =
  GetFieldAtPath<TSchema, TPath> extends infer Field
    ? Field extends FieldType | DetailedField
      ? OperationsForFieldType<ExtractFieldType<Field>> | FieldValueType<ExtractFieldType<Field>>
      : never
    : never;

// Create a type for a query leaf (only field paths, no boolean operators)
type FieldClauses<TSchema> = {
  [P in SchemaPaths<TSchema>]?: PathOperations<TSchema, P>;
};

type NoFieldClauses<TSchema> = {
  [P in SchemaPaths<TSchema>]?: never;
};

/** One query, or several. `$must` and `$and` need all of them to match, `$should` and `$or` one. */
type QueryGroup<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  | QueryFilter<TSchema>
  | readonly QueryFilter<TSchema>[];

type SharedClauses<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  $should?: QueryGroup<TSchema>;
  $mustNot?: QueryGroup<TSchema>;
  /** A number scales the score of this query. `{ query, value }` scales the score of one sub-query. */
  $boost?: number | { query: QueryFilter<TSchema>; value: number };
  // Retrievers are valid only at the root of a query and inside `$rrf`
  $ann?: never;
  $standard?: never;
  $rrf?: never;
};

export type QueryFilter<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  IsDefaultSchema<TSchema> extends true
    ? Record<string, any>
    :
        | (FieldClauses<TSchema> &
            SharedClauses<TSchema> & {
              $must?: QueryGroup<TSchema>;
              $and?: QueryGroup<TSchema>;
              $or?: never;
            })
        // Next to a field, `$must` or `$and`, an `$or` only adds to the score and stops filtering
        // and so does a `$boost` object, which is a `$must` clause
        | (NoFieldClauses<TSchema> &
            Omit<SharedClauses<TSchema>, "$boost"> & {
              $or: QueryGroup<TSchema>;
              $boost?: number;
              $must?: never;
              $and?: never;
            });

export type RootQueryFilter<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  QueryFilter<TSchema>;

// Retrievers
// @see https://upstash.com/docs/redis/search/retrievers/overview

/** A retriever must be the only key of its object. */
type RetrieverAlone<TSchema, TKey extends string> =
  IsDefaultSchema<TSchema> extends true
    ? // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {}
    : NoFieldClauses<TSchema> & {
        [K in
          | "$must"
          | "$should"
          | "$mustNot"
          | "$and"
          | "$or"
          | "$boost"
          | "$ann"
          | "$standard"
          | "$rrf" as K extends TKey ? never : K]?: never;
      };

/** `weight` is valid only for a retriever inside `$rrf`. */
type RetrieverWeight<TInRrf extends boolean> = TInRrf extends true
  ? {
      /** Scales how much the retriever adds to the `$rrf` score. Defaults to `1`. */
      weight?: number;
    }
  : { weight?: never };

/**
 * Runs a semantic search on a HYBRID field.
 *
 * @see https://upstash.com/docs/redis/search/retrievers/ann
 */
export type AnnRetriever<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TInRrf extends boolean = false,
> = {
  $ann: {
    /** The HYBRID field to search */
    field: IsDefaultSchema<TSchema> extends true ? string : PathsOfType<TSchema, "HYBRID">;
    /** The text to search for. Cannot be empty. */
    query: string;
    /** Accuracy and speed trade-off. Defaults to `balanced`. */
    profile?: "fast" | "balanced" | "precise";
    /** Only documents that match this query are returned */
    filter?: QueryFilter<TSchema>;
  } & RetrieverWeight<TInRrf>;
} & RetrieverAlone<TSchema, "$ann">;

/**
 * Runs one query. Use it inside `$rrf` to set the weight of a query.
 *
 * @see https://upstash.com/docs/redis/search/retrievers/standard
 */
export type StandardRetriever<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TInRrf extends boolean = false,
> = {
  $standard: {
    query: QueryFilter<TSchema>;
  } & RetrieverWeight<TInRrf>;
} & RetrieverAlone<TSchema, "$standard">;

/**
 * Merges the results of 2 to 10 retrievers with Reciprocal Rank Fusion.
 *
 * @see https://upstash.com/docs/redis/search/retrievers/rrf
 */
export type RrfRetriever<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TAllowAnn extends boolean = true,
> = {
  $rrf: {
    /** 2 to 10 retrievers to merge */
    retrievers: readonly (
      | QueryFilter<TSchema>
      | StandardRetriever<TSchema, true>
      | (TAllowAnn extends true ? AnnRetriever<TSchema, true> : never)
    )[];
    /** Higher values give lower-ranked results more influence. Defaults to `60`. */
    rankConstant?: number;
    /** The number of results each retriever contributes. Defaults to `LIMIT`. */
    window?: number;
  };
} & RetrieverAlone<TSchema, "$rrf">;

export type Retriever<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  | AnnRetriever<TSchema>
  | StandardRetriever<TSchema>
  | RrfRetriever<TSchema>;

/**
 * Retrievers accepted by `SEARCH.COUNT` and `SEARCH.AGGREGATE`, which do not support `$ann`.
 */
export type CountRetriever<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  | StandardRetriever<TSchema>
  | RrfRetriever<TSchema, false>;

/** Paths of HYBRID fields */
export type HybridPaths<TSchema> = PathsOfType<TSchema, "HYBRID">;

export type DescribeFieldInfo = {
  type: FieldType;
  noTokenize?: boolean;
  noStem?: boolean;
  fast?: boolean;
  from?: string;
};

export type IndexDescription<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  name: string;
  dataType: "hash" | "string" | "json" | "stream";
  /**
   * Key prefixes tracked by the index. For a stream index, this holds the single stream key.
   */
  prefixes: string[];
  language?: Language;
  schema: IsDefaultSchema<TSchema> extends true
    ? Record<string, DescribeFieldInfo>
    : Record<SchemaPaths<TSchema>, DescribeFieldInfo>;
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

// Helper type to extract only FACET field paths from schema
export type FacetPaths<T, Prefix extends string = ""> = {
  [K in keyof T]: K extends string
    ? T[K] extends "FACET" | { type: "FACET" }
      ? Prefix extends ""
        ? K
        : `${Prefix}${K}`
      : T[K] extends FieldType | DetailedField
        ? never
        : T[K] extends object
          ? FacetPaths<T[K], `${Prefix}${K}.`>
          : never
    : never;
}[keyof T];

// Aggregate Types
export type AggregateOptions<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  IsDefaultSchema<TSchema> extends true
    ? {
        filter?: Record<string, any>;
        aggregations: {
          [key: string]: Record<string, any>;
        };
      }
    : {
        filter?: QueryFilter<TSchema> | CountRetriever<TSchema>;
        aggregations: {
          [key: string]: Aggregation<TSchema>;
        };
      };

export type Aggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  IsDefaultSchema<TSchema> extends true
    ? Record<string, any>
    :
        | TermsAggregation<TSchema>
        | RangeAggregation<TSchema>
        | HistogramAggregation<TSchema>
        | DateHistogramAggregation<TSchema>
        | CompositeAggregation<TSchema>
        | StatsAggregation<TSchema>
        | AvgAggregation<TSchema>
        | SumAggregation<TSchema>
        | MinAggregation<TSchema>
        | MaxAggregation<TSchema>
        | CountAggregation<TSchema>
        | ExtendedStatsAggregation<TSchema>
        | PercentilesAggregation<TSchema>
        | CardinalityAggregation<TSchema>
        | FacetAggregation<TSchema>;

// Fields each aggregation accepts. KEYWORD fields are always FAST; other types need `.fast()`.
type TermsPaths<TSchema> = FastPaths<TSchema, "KEYWORD" | NumericType | "BOOL" | "DATE">;
type HistogramPaths<TSchema> = FastPaths<TSchema, NumericType | "DATE">;
type DatePaths<TSchema> = FastPaths<TSchema, "DATE">;
type MetricPaths<TSchema> = FastPaths<TSchema, NumericType | "BOOL" | "DATE">;

/** Bucket aggregations can have sub-aggregations. */
type BucketAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> = {
  $aggs?: {
    [key: string]: Aggregation<TSchema>;
  };
};

/** Metric aggregations cannot have sub-aggregations. */
type MetricAggregation = { $aggs?: never };

type Bounds = { min: number; max: number };

export type TermsAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  BucketAggregation<TSchema> & {
    $terms: {
      field: TermsPaths<TSchema>;
      size?: number;
      segmentSize?: number;
      showTermDocCountError?: boolean;
      minDocCount?: number;
      /** `{ count: "desc" }`, `{ key: "asc" }`, or `{ <sub-aggregation name>: "desc" }` */
      order?: Record<string, "asc" | "desc">;
      /** Bucket key used when the field is missing */
      missing?: string | number;
      /** A regex, or a list of values */
      include?: string | readonly string[];
      /** A regex, or a list of values */
      exclude?: string | readonly string[];
    };
  };

export type RangeAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  BucketAggregation<TSchema> & {
    $range: {
      field: HistogramPaths<TSchema>;
      ranges: readonly { key?: string; from?: number; to?: number }[];
      keyed?: boolean;
    };
  };

export type HistogramAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  BucketAggregation<TSchema> & {
    $histogram: {
      field: HistogramPaths<TSchema>;
      interval: number;
      offset?: number;
      minDocCount?: number;
      hardBounds?: Bounds;
      extendedBounds?: Bounds;
      keyed?: boolean;
    };
  };

/**
 * @see https://upstash.com/docs/redis/search/aggregation-operators/bucket-aggregations/date-histogram
 */
export type DateHistogramAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  BucketAggregation<TSchema> & {
    $dateHistogram: {
      field: DatePaths<TSchema>;
      /** Such as `"1m"`, `"1h"` or `"1d"` */
      fixedInterval: string;
      offset?: string;
      minDocCount?: number;
      hardBounds?: Bounds;
      extendedBounds?: Bounds;
      keyed?: boolean;
    };
  };

type CompositeSourceOptions = {
  order?: "asc" | "desc";
  missingBucket?: boolean;
  missingOrder?: "default" | "first" | "last";
};

type CompositeSource<TSchema> =
  | { $terms: { field: TermsPaths<TSchema> } & CompositeSourceOptions }
  | { $histogram: { field: HistogramPaths<TSchema>; interval: number } & CompositeSourceOptions }
  | {
      $dateHistogram: { field: DatePaths<TSchema> } & (
        | { fixedInterval: string; calendarInterval?: never }
        | { calendarInterval: "year" | "month" | "week"; fixedInterval?: never }
      ) &
        CompositeSourceOptions;
    };

/**
 * @see https://upstash.com/docs/redis/search/aggregation-operators/bucket-aggregations/composite
 */
export type CompositeAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  BucketAggregation<TSchema> & {
    $composite: {
      /** Each entry names one source, such as `{ category: { $terms: { field: "category" } } }` */
      // `undefined` lets TypeScript infer arrays of differently named sources
      sources: readonly { [name: string]: CompositeSource<TSchema> | undefined }[];
      /** Buckets per page. Defaults to `10`. */
      size?: number;
      /** The `afterKey` of the previous page */
      after?: Record<string, string> | undefined;
    };
  };

export type StatsAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  MetricAggregation & {
    $stats: {
      field: MetricPaths<TSchema>;
      missing?: number;
    };
  };

export type AvgAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  MetricAggregation & {
    $avg: {
      field: MetricPaths<TSchema>;
      missing?: number;
    };
  };

export type SumAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  MetricAggregation & {
    $sum: {
      field: MetricPaths<TSchema>;
      missing?: number;
      /** Return `null` instead of `0` when no values are collected */
      nullIfNoMatch?: boolean;
    };
  };

export type MinAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  MetricAggregation & {
    $min: {
      field: MetricPaths<TSchema>;
      missing?: number;
    };
  };

export type MaxAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  MetricAggregation & {
    $max: {
      field: MetricPaths<TSchema>;
      missing?: number;
    };
  };

export type CountAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  MetricAggregation & {
    $count: {
      field: TermsPaths<TSchema>;
      missing?: number;
    };
  };

export type ExtendedStatsAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  MetricAggregation & {
    $extendedStats: {
      field: HistogramPaths<TSchema>;
      sigma?: number;
      missing?: number;
    };
  };

export type PercentilesAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  MetricAggregation & {
    $percentiles: {
      field: HistogramPaths<TSchema>;
      percents?: readonly number[];
      keyed?: boolean;
      missing?: number;
    };
  };

export type CardinalityAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  MetricAggregation & {
    $cardinality: {
      field: TermsPaths<TSchema>;
      missing?: string | number;
    };
  };

export type FacetAggregation<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  MetricAggregation & {
    $facet: {
      field: FacetPaths<TSchema>;
      path: string;
      depth?: number;
      size?: number;
      minDocCount?: number;
      order?: { count: "desc" | "asc" } | { path: "desc" | "asc" };
    };
  };

export type AggregateResult<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TOpts extends { aggregations: unknown },
> =
  IsDefaultSchema<TSchema> extends true
    ? Record<string, any>
    : BuildAggregateResult<
        TSchema,
        Extract<TOpts["aggregations"], { [key: string]: Aggregation<TSchema> }>
      >;

type BuildAggregateResult<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TAggs extends { [key: string]: Aggregation<TSchema> },
> = {
  // Dispatch on the operator key, which survives TypeScript's normalization of array literals
  [K in keyof TAggs]: TAggs[K] extends { $terms: { field: infer TField } }
    ? TermsResult<TSchema, TAggs[K], TField & string>
    : TAggs[K] extends { $range: infer TParams }
      ? BucketsResult<TSchema, TAggs[K], RangeBucket, TParams>
      : TAggs[K] extends { $histogram: infer TParams }
        ? BucketsResult<TSchema, TAggs[K], HistogramBucket, TParams>
        : TAggs[K] extends { $dateHistogram: infer TParams }
          ? BucketsResult<TSchema, TAggs[K], DateHistogramBucket, TParams>
          : TAggs[K] extends { $composite: { sources: infer TSources } }
            ? CompositeResult<TSchema, TAggs[K], CompositeSourceNames<TSources>>
            : TAggs[K] extends { $stats: unknown }
              ? StatsResult
              : TAggs[K] extends
                    | { $avg: unknown }
                    | { $sum: unknown }
                    | { $min: unknown }
                    | { $max: unknown }
                    | { $count: unknown }
                    | { $cardinality: unknown }
                ? MetricValueResult
                : TAggs[K] extends { $extendedStats: unknown }
                  ? ExtendedStatsResult
                  : TAggs[K] extends { $percentiles: unknown }
                    ? PercentilesResult<TAggs[K]>
                    : TAggs[K] extends { $facet: unknown }
                      ? FacetResult
                      : never;
};

type Bucket<T> = {
  key: T;
  docCount: number;
};

/** The results of sub-aggregations, merged into each bucket. */
type SubAggregations<TSchema extends NestedIndexSchema | FlatIndexSchema, TAgg> = TAgg extends {
  $aggs: infer TSub;
}
  ? TSub extends { [key: string]: Aggregation<TSchema> }
    ? BuildAggregateResult<TSchema, TSub>
    : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {}
  : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {};

/** `keyed: true` returns the buckets as an object keyed by the bucket key. */
type BucketsResult<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TAgg,
  TBucket,
  TParams,
> = TParams extends { keyed: true }
  ? { buckets: { [key: string]: TBucket & SubAggregations<TSchema, TAgg> } }
  : { buckets: (TBucket & SubAggregations<TSchema, TAgg>)[] };

/** BOOL keys are `0` or `1`, and DATE keys are RFC 3339 strings. */
type TermsKey<TSchema, TField extends string> =
  ExtractFieldType<GetFieldAtPath<TSchema, TField>> extends "BOOL"
    ? number
    : GetFieldValueType<TSchema, TField>;

type TermsResult<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TAgg,
  TField extends string,
> = {
  buckets: (Bucket<TermsKey<TSchema, TField>> & {
    /** The value of a BOOL key */
    keyAsString?: boolean | string;
  } & SubAggregations<TSchema, TAgg>)[];
  sumOtherDocCount: number;
  docCountErrorUpperBound: number;
};

type RangeBucket = Bucket<string> & {
  from?: number;
  to?: number;
  fromAsString?: string;
  toAsString?: string;
};

type HistogramBucket = Bucket<number> & {
  /** Set for DATE fields */
  keyAsString?: string;
};

type DateHistogramBucket = Bucket<number> & {
  keyAsString: string;
};

type CompositeResult<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TAgg,
  TNames extends string,
> = {
  buckets: (Bucket<{ [K in TNames]: string | number | null }> & SubAggregations<TSchema, TAgg>)[];
  /** Pass it as `after` to get the next page. Missing when the page is empty. */
  afterKey?: { [K in TNames]: string };
};

type CompositeSourceNames<TSources> = TSources extends readonly (infer TSource)[]
  ? TSource extends unknown
    ? keyof TSource & string
    : never
  : never;

type MetricValueResult = {
  value: number;
};

type StatsResult = {
  count: number;
  min: number;
  max: number;
  sum: number;
  avg: number;
};

type ExtendedStatsResult = {
  count: number;
  min: number;
  max: number;
  avg: number;
  sum: number;
  sumOfSquares: number;
  variance: number;
  variancePopulation: number;
  varianceSampling: number;
  stdDeviation: number;
  stdDeviationPopulation: number;
  stdDeviationSampling: number;
  stdDeviationBounds: {
    upper: number;
    lower: number;
    upperSampling: number;
    lowerSampling: number;
    upperPopulation: number;
    lowerPopulation: number;
  };
};

type PercentilesResult<TAgg> = TAgg extends { $percentiles: { keyed: false } }
  ? {
      values: Array<{ key: number; value: number }>;
    }
  : {
      values: { [key: string]: number };
    };

type FacetChildNode = {
  path: string;
  docCount: number;
  sumOtherDocCount: number;
  children?: FacetChildNode[];
};

type FacetResult = {
  path: string;
  sumOtherDocCount: number;
  children: FacetChildNode[];
};
