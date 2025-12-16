import {
  DescribeFieldInfo,
  DetailedField,
  FIELD_TYPES,
  FlatIndexSchema,
  IndexDescription,
  Language,
  QueryOptions,
  QueryResult,
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

    if (!Array.isArray(rawFields) || rawFields.length === 0) {
      return { key, score, data: {} } as QueryResult<TSchema, TOptions>;
    }

    // Merge all field objects into a single object
    const mergedFields: Record<string, unknown> = {};
    for (const fieldRaw of rawFields) {
      const fieldObj = kvArrayToObject<Record<string, unknown>>(fieldRaw);
      Object.assign(mergedFields, fieldObj);
    }

    // If $ key exists (full document), use its contents directly
    if ("$" in mergedFields) {
      const data = mergedFields["$"] as Record<string, unknown>;
      return { key, score, data } as QueryResult<TSchema, TOptions>;
    }

    // Otherwise, convert dot notation keys to nested structure
    const data = dotNotationToNested(mergedFields);

    return { key, score, data } as QueryResult<TSchema, TOptions>;
  });
}

/**
 * Parses a raw field array from SEARCH.DESCRIBE into a DescribeFieldInfo object.
 * Raw format: ["fieldName", "TYPE", "OPTION1", "OPTION2", ...]
 * Options can be: NOTOKENIZE, NOSTEM, FAST
 */
function parseFieldInfo(fieldRaw: unknown[]): DescribeFieldInfo {
  const fieldType = fieldRaw[1] as FieldType;
  const options = fieldRaw.slice(2) as string[];

  const fieldInfo: DescribeFieldInfo = { type: fieldType };

  for (const option of options) {
    switch (option.toUpperCase()) {
      case "NOTOKENIZE":
        fieldInfo.noTokenize = true;
        break;
      case "NOSTEM":
        fieldInfo.noStem = true;
        break;
      case "FAST":
        fieldInfo.fast = true;
        break;
    }
  }

  return fieldInfo;
}

export function deserializeDescribeResponse<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  rawResponse: unknown
): IndexDescription<TSchema> {
  const raw = kvArrayToObject<{
    name: string;
    type: "hash" | "string";
    prefixes: string[];
    language?: Language;
    schema: unknown[];
  }>(rawResponse);

  const schema: Record<string, DescribeFieldInfo> = {};
  if (Array.isArray(raw.schema)) {
    for (const fieldRaw of raw.schema) {
      if (Array.isArray(fieldRaw) && fieldRaw.length >= 2) {
        const fieldName = fieldRaw[0] as string;
        schema[fieldName] = parseFieldInfo(fieldRaw);
      }
    }
  }

  return {
    name: raw.name,
    dataType: raw.type.toLowerCase() as "hash" | "string",
    prefixes: raw.prefixes,
    ...(raw.language && { language: raw.language as Language }),
    schema,
  } as IndexDescription<TSchema>;
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

/**
 * Converts dot notation keys to nested objects
 * e.g. { "content.title": "Hello", "content.author": "John" }
 * becomes { content: { title: "Hello", author: "John" } }
 */
export function dotNotationToNested<T extends Record<string, unknown>>(
  obj: Record<string, unknown>
): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(".");
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    current[parts[parts.length - 1]] = value;
  }

  return result as T;
}
