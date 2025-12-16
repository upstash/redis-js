import type { NestedIndexSchema, NumericField } from "./types";

// Internal symbol for build method
const BUILD = Symbol("build");

// Field builders with chainable options
class TextFieldBuilder<
  NoTokenize extends Record<"noTokenize", boolean> = { noTokenize: false },
  NoStem extends Record<"noStem", boolean> = { noStem: false },
> {
  private _noTokenize: NoTokenize;
  private _noStem: NoStem;

  constructor(
    noTokenize = { noTokenize: false } as NoTokenize,
    noStem = { noStem: false } as NoStem
  ) {
    this._noTokenize = noTokenize;
    this._noStem = noStem;
  }

  noTokenize(): TextFieldBuilder<{ noTokenize: true }, NoStem> {
    return new TextFieldBuilder({ noTokenize: true }, this._noStem);
  }

  noStem(): TextFieldBuilder<NoTokenize, { noStem: true }> {
    return new TextFieldBuilder(this._noTokenize, { noStem: true });
  }

  [BUILD](): NoTokenize extends { noTokenize: true }
    ? NoStem extends { noStem: true }
      ? { type: "TEXT"; noTokenize: true; noStem: true }
      : { type: "TEXT"; noTokenize: true }
    : NoStem extends { noStem: true }
      ? { type: "TEXT"; noStem: true }
      : "TEXT" {
    return this._noTokenize.noTokenize || this._noStem.noStem
      ? ({
          type: "TEXT",
          ...(this._noTokenize.noTokenize ? { noTokenize: true } : {}),
          ...(this._noStem.noStem ? { noStem: true } : {}),
        } as any)
      : ("TEXT" as any);
  }
}

class NumericFieldBuilder<T extends NumericField["type"]> {
  private type: T;

  constructor(type: T) {
    this.type = type;
  }

  [BUILD](): { type: T; fast: true } {
    return {
      type: this.type,
      fast: true,
    };
  }
}

class BoolFieldBuilder<Fast extends Record<"fast", boolean> = { fast: false }> {
  private _fast: Fast;

  constructor(fast = { fast: false } as Fast) {
    this._fast = fast;
  }

  fast(): BoolFieldBuilder<{ fast: true }> {
    return new BoolFieldBuilder({ fast: true });
  }

  [BUILD](): Fast extends { fast: true } ? { type: "BOOL"; fast: true } : "BOOL" {
    return this._fast.fast
      ? ({
          type: "BOOL",
          fast: true,
        } as any)
      : ("BOOL" as any);
  }
}

class DateFieldBuilder<Fast extends Record<"fast", boolean> = { fast: false }> {
  private _fast: Fast;

  constructor(fast = { fast: false } as Fast) {
    this._fast = fast;
  }

  fast(): DateFieldBuilder<{ fast: true }> {
    return new DateFieldBuilder({ fast: true });
  }

  [BUILD](): Fast extends { fast: true } ? { type: "DATE"; fast: true } : "DATE" {
    return this._fast.fast
      ? ({
          type: "DATE",
          fast: true,
        } as any)
      : ("DATE" as any);
  }
}

type FieldBuilder =
  | TextFieldBuilder<{ noTokenize: boolean }, { noStem: boolean }>
  | NumericFieldBuilder<NumericField["type"]>
  | BoolFieldBuilder<{ fast: boolean }>
  | DateFieldBuilder<{ fast: boolean }>;

export const s = {
  string(): TextFieldBuilder {
    return new TextFieldBuilder();
  },
  number<T extends NumericField["type"] = "F64">(type: T = "F64" as T): NumericFieldBuilder<T> {
    return new NumericFieldBuilder(type);
  },
  boolean(): BoolFieldBuilder {
    return new BoolFieldBuilder();
  },
  date(): DateFieldBuilder {
    return new DateFieldBuilder();
  },
  object<T extends ObjectFieldRecord<T>>(fields: T) {
    const result: any = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value && typeof value === "object" && BUILD in value) {
        // It's a field builder
        result[key] = (value as any)[BUILD]();
      } else {
        // It's a nested object/schema
        result[key] = value;
      }
    }
    return result as {
      [K in keyof T]: T[K] extends FieldBuilder ? ReturnType<T[K][typeof BUILD]> : T[K];
    };
  },
};

type ObjectFieldRecord<T> = {
  [K in keyof T]: K extends string
    ? K extends `${infer _}.${infer _}`
      ? never
      : T[K] extends FieldBuilder | NestedIndexSchema
        ? T[K]
        : never
    : never;
};
