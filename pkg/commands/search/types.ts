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
export type StringIndexSchema = {
  [key: string]: FieldType | DetailedField | StringIndexSchema;
};

export type HashIndexSchema = {
  [key: string]: FieldType | DetailedField;
};
type InferFieldType<T extends FieldType | DetailedField> = T extends "TEXT"
  ? string
  : T extends "U64" | "I64" | "F64"
    ? number
    : T extends "BOOL"
      ? boolean
      : T extends "DATE"
        ? Date
        : T extends { type: infer Inner }
          ? Inner extends FieldType
            ? InferFieldType<Inner>
            : never
          : never;

export type InferStringSchemaData<TSchema extends StringIndexSchema> = {
  [K in keyof TSchema]: TSchema[K] extends FieldType | DetailedField
    ? InferFieldType<TSchema[K]>
    : TSchema[K] extends StringIndexSchema
      ? InferStringSchemaData<TSchema[K]>
      : never;
};
export type InferHashSchemaData<TSchema extends HashIndexSchema> = {
  [K in keyof TSchema]: TSchema[K] extends FieldType | DetailedField
    ? InferFieldType<TSchema[K]>
    : never;
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

export type PrefixedKey<TPrefix> = TPrefix extends readonly string[]
  ? `${TPrefix[number]}${string}`
  : TPrefix extends string
    ? `${TPrefix}${string}`
    : string;
