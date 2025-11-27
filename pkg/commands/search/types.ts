export const FIELD_TYPES = ["TEXT", "U64", "I64", "F64", "BOOL", "DATE"] as const;
export type FieldType = (typeof FIELD_TYPES)[number];

export type TextField = {
  type: "TEXT";
  noTokenize?: boolean;
  noStem?: boolean;
};

export type NumericField = {
  type: "U64" | "I64" | "F64";
  fast?: boolean;
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

export type QueryOptions<TSchema extends NestedIndexSchema | FlatIndexSchema> =
  | {
      limit?: number;
      offset?: number;
      noContent: true;
      sortBy?: {
        field: SchemaPaths<TSchema>;
        direction?: "ASC" | "DESC";
      };
    }
  | {
      limit?: number;
      offset?: number;
      noContent?: false;
      sortBy?: {
        field: SchemaPaths<TSchema>;
        direction?: "ASC" | "DESC";
      };
      returnFields?: (SchemaPaths<TSchema> | "$")[];
    };

type FieldValuePair<TSchema, TField extends string> = TField extends "$"
  ? { $: InferSchemaData<TSchema> }
  : TField extends SchemaPaths<TSchema>
    ? { [K in TField]: GetFieldValueType<TSchema, TField> }
    : never;

export type QueryResult<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TOptions extends QueryOptions<TSchema> | undefined = undefined,
> = TOptions extends { noContent: true }
  ? { key: string; score: string }
  : TOptions extends { returnFields: infer TFields extends readonly string[] }
    ? { key: string; score: string; fields: Array<FieldValuePair<TSchema, TFields[number]>> } // Specific fields only
    : {
        key: string;
        score: string;
        fields: Array<FieldValuePair<TSchema, SchemaPaths<TSchema> | "$">>;
      };

export type QueryResponse<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TOptions extends QueryOptions<TSchema> | undefined = undefined,
> = Array<QueryResult<TSchema, TOptions>>;

export function parseQueryResponse<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TOptions extends QueryOptions<TSchema> | undefined = undefined,
>(rawResponse: any[], options?: TOptions): QueryResponse<TSchema, TOptions> {
  const results: any[] = [];

  const isStructured = Array.isArray(rawResponse[0]);

  if (options && "noContent" in options && options.noContent) {
    if (isStructured) {
      for (const item of rawResponse) {
        results.push({
          key: item[0],
          score: item[1],
        });
      }
    } else {
      for (let i = 0; i < rawResponse.length; i += 2) {
        results.push({
          key: rawResponse[i],
          score: rawResponse[i + 1],
        });
      }
    }
  } else {
    if (isStructured) {
      for (const item of rawResponse) {
        const fields = Array.isArray(item[2])
          ? item[2].map((field: any) => ({
              [field[0]]: field[1],
            }))
          : [];

        results.push({
          key: item[0],
          score: item[1],
          fields,
        });
      }
    } else {
      for (let i = 0; i < rawResponse.length; i += 3) {
        const fields = Array.isArray(rawResponse[i + 2])
          ? rawResponse[i + 2].map((field: any) => ({
              [field[0]]: field[1],
            }))
          : [];

        results.push({
          key: rawResponse[i],
          score: rawResponse[i + 1],
          fields,
        });
      }
    }
  }

  return results as QueryResponse<TSchema, TOptions>;
}

export type IndexDescription = {
  indexName: string;
  dataType: "hash" | "string";
  prefixes: string[];
  language?: string;
  fields: Array<{
    name: string;
    type: FieldType;
    noTokenize?: boolean;
    noStem?: boolean;
    fast?: boolean;
  }>;
};

export function parseDescribeResponse(rawResponse: any): IndexDescription {
  return rawResponse as IndexDescription;
}

export function parseCountResponse(rawResponse: any): number {
  return typeof rawResponse === "number" ? rawResponse : parseInt(rawResponse, 10);
}
