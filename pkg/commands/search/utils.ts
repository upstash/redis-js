import {
  DetailedField,
  FIELD_TYPES,
  FlatIndexSchema,
  IndexDescription,
  QueryOptions,
  QueryResult,
  QueryResultFields,
  type FieldType,
  type NestedIndexSchema,
} from "./types";

type FlattenedField = {
  path: string;
  type: FieldType;
  fast?: boolean;
  noTokenize?: boolean;
  noStem?: boolean;
};

function isFieldType(value: any): value is FieldType {
  return typeof value === "string" && (FIELD_TYPES as readonly string[]).includes(value);
}

function isDetailedField(value: any): value is DetailedField {
  return typeof value === "object" && value !== null && "type" in value && isFieldType(value.type);
}

function isNestedSchema(value: any): value is NestedIndexSchema {
  return typeof value === "object" && value !== null && !isDetailedField(value);
}

export function flattenSchema(
  schema: NestedIndexSchema | FlatIndexSchema,
  pathPrefix: string[] = []
): FlattenedField[] {
  const fields: FlattenedField[] = [];

  for (const [key, value] of Object.entries(schema)) {
    const currentPath = [...pathPrefix, key];
    const pathString = currentPath.join(".");

    if (isFieldType(value)) {
      fields.push({
        path: pathString,
        type: value,
      });
    } else if (isDetailedField(value)) {
      fields.push({
        path: pathString,
        type: value.type as FieldType,
        fast: "fast" in value ? value.fast : undefined,
        noTokenize: "noTokenize" in value ? value.noTokenize : undefined,
        noStem: "noStem" in value ? value.noStem : undefined,
      });
    } else if (isNestedSchema(value)) {
      const nestedFields = flattenSchema(value, currentPath);
      fields.push(...nestedFields);
    }
  }

  return fields;
}

export function deserializeQueryResponse<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TOptions extends QueryOptions<TSchema> | undefined = undefined,
>(rawResponse: unknown[], options?: TOptions): QueryResult<TSchema, TOptions>[] {
  const hasEmptySelect = options?.select && Object.keys(options.select).length === 0;

  return rawResponse.map((itemRaw) => {
    const raw = itemRaw as [string, string, unknown[]?];
    const key = raw[0];
    const score = raw[1];
    const rawFields = raw[2];

    if (hasEmptySelect) {
      return { key, score } as QueryResult<TSchema, TOptions>;
    }

    const fields = Array.isArray(rawFields)
      ? rawFields.map((fieldRaw) => kvArrayToObject<QueryResultFields<TSchema, TOptions>>(fieldRaw))
      : [];

    return { key, score, fields } as unknown as QueryResult<TSchema, TOptions>;
  });
}

export function deserializeDescribeResponse(rawResponse: unknown): IndexDescription {
  const raw = kvArrayToObject<{
    name: string;
    type: string;
    prefixes: string[];
    language?: string;
    schema: unknown[];
  }>(rawResponse);

  const schema: FlatIndexSchema = {};
  if (Array.isArray(raw.schema)) {
    for (const fieldRaw of raw.schema) {
      if (Array.isArray(fieldRaw) && fieldRaw.length >= 2) {
        const fieldName = fieldRaw[0] as string;
        const fieldType = fieldRaw[1] as FieldType;
        schema[fieldName] = fieldType;
      }
    }
  }

  return {
    indexName: raw.name,
    dataType: raw.type.toLowerCase() as "hash" | "string",
    prefixes: raw.prefixes,
    ...(raw.language && { language: raw.language }),
    schema,
  };
}

export function parseCountResponse(rawResponse: any): number {
  return typeof rawResponse === "number" ? rawResponse : parseInt(rawResponse, 10);
}

export function kvArrayToObject<T extends Record<string, unknown>>(v: unknown): T {
  if (typeof v === "object" && v !== null && !Array.isArray(v)) return v as T;
  if (!Array.isArray(v)) return {} as T;
  const obj: T = {} as T;
  for (let i = 0; i < v.length; i += 2) {
    if (typeof v[i] === "string") obj[v[i] as keyof T] = v[i + 1] as T[keyof T];
  }
  return obj;
}
