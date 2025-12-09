import {
  DetailedField,
  FIELD_TYPES,
  FlatIndexSchema,
  IndexDescription,
  QueryOptions,
  QueryResponse,
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

export function parseQueryResponse<
  TSchema extends NestedIndexSchema | FlatIndexSchema,
  TOptions extends QueryOptions<TSchema> | undefined = undefined,
>(rawResponse: any[], options?: TOptions): QueryResponse<TSchema, TOptions> {
  const results: any[] = [];

  if (options && "noContent" in options && options.noContent) {
    for (const item of rawResponse) {
      results.push({
        key: item[0],
        score: item[1],
      });
    }
  } else {
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
  }

  return results;
}

export function parseDescribeResponse(rawResponse: any): IndexDescription {
  return rawResponse as IndexDescription;
}

export function parseCountResponse(rawResponse: any): number {
  return typeof rawResponse === "number" ? rawResponse : parseInt(rawResponse, 10);
}
