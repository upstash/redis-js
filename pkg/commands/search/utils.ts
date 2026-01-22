import type {
  DescribeFieldInfo,
  DetailedField,
  FlatIndexSchema,
  IndexDescription,
  Language,
  QueryOptions,
  QueryResult,
} from "./types";
import { FIELD_TYPES, type FieldType, type NestedIndexSchema } from "./types";

type FlattenedField = {
  path: string;
  type: FieldType;
  fast?: boolean;
  noTokenize?: boolean;
  noStem?: boolean;
  from?: string;
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
        from: "from" in value ? value.from : undefined,
      });
    } else if (isNestedSchema(value)) {
      const nestedFields = flattenSchema(value, currentPath);
      fields.push(...nestedFields);
    }
  }

  return fields;
}

export function deserializeQueryResponse<
  TSchema extends NestedIndexSchema | FlatIndexSchema = any,
  TOptions extends QueryOptions<TSchema> | undefined = any,
>(rawResponse: unknown[]): QueryResult<TSchema, TOptions>[] {
  return rawResponse.map((itemRaw) => {
    const raw = itemRaw as [string, string, unknown[]?];
    const key = raw[0];
    const score = raw[1];
    const rawFields = raw[2];

    if (rawFields === undefined) {
      return { key, score } as QueryResult<TSchema, TOptions>;
    }

    if (!Array.isArray(rawFields) || rawFields.length === 0) {
      return { key, score, data: {} } as QueryResult<TSchema, TOptions>;
    }

    // Merge all field objects into a single object
    let data: Record<string, unknown> = {};

    for (const fieldRaw of rawFields as [string, unknown][]) {
      const key = fieldRaw[0];
      const value = fieldRaw[1];

      const pathParts = key.split(".");
      if (pathParts.length == 1) {
        data[key] = value;
      } else {
        let currentObj = data;
        for (let i = 0; i < pathParts.length - 1; i++) {
          const pathPart = pathParts[i];
          if (!(pathPart in currentObj)) {
            currentObj[pathPart] = {};
          }

          currentObj = currentObj[pathPart] as Record<string, unknown>;
        }

        currentObj[pathParts.at(-1)!] = value;
      }
    }

    // If $ key exists (full document), use its contents directly
    if ("$" in data) {
      data = data["$"] as Record<string, unknown>;
    }

    return { key, score, data } as QueryResult<TSchema, TOptions>;
  });
}

export function deserializeDescribeResponse<TSchema extends NestedIndexSchema | FlatIndexSchema>(
  rawResponse: unknown[]
): IndexDescription<TSchema> {
  const description = {} as IndexDescription<TSchema>;

  for (let i = 0; i < rawResponse.length; i += 2) {
    const descriptor = rawResponse[i] as string;
    switch (descriptor) {
      case "name": {
        description["name"] = rawResponse[i + 1] as string;
        break;
      }
      case "type": {
        description["dataType"] = (rawResponse[i + 1] as string).toLowerCase() as
          | "hash"
          | "string"
          | "json";
        break;
      }
      case "prefixes": {
        description["prefixes"] = rawResponse[i + 1] as string[];
        break;
      }
      case "language": {
        description["language"] = rawResponse[i + 1] as Language;
        break;
      }
      case "schema": {
        const schema: Record<string, DescribeFieldInfo> = {};
        for (const fieldDescription of rawResponse[i + 1] as string[][]) {
          const fieldName = fieldDescription[0];
          const fieldInfo: DescribeFieldInfo = { type: fieldDescription[1] as FieldType };

          if (fieldDescription.length > 2) {
            for (let j = 2; j < fieldDescription.length; j++) {
              const fieldOption = fieldDescription[j];
              switch (fieldOption) {
                case "NOSTEM": {
                  fieldInfo.noStem = true;
                  break;
                }
                case "NOTOKENIZE": {
                  fieldInfo.noTokenize = true;
                  break;
                }
                case "FAST": {
                  fieldInfo.fast = true;
                  break;
                }
              }
            }
          }

          schema[fieldName] = fieldInfo;
        }
        description["schema"] = schema;
        break;
      }
    }
  }

  return description;
}

export function parseCountResponse(rawResponse: any): number {
  return typeof rawResponse === "number" ? rawResponse : Number.parseInt(rawResponse, 10);
}
