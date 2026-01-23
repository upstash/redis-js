import type { NestedIndexSchema, NumericField } from "./types";

type TextFieldBuild<
  TNoTokenize extends Record<"noTokenize", boolean>,
  TNoStem extends Record<"noStem", boolean>,
  TFrom extends Record<"from", string | null>,
> = TNoTokenize["noTokenize"] extends true
  ? { type: "TEXT"; noTokenize: true } & (TNoStem["noStem"] extends true
      ? { noStem: true }
      : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        {}) &
      (TFrom["from"] extends string
        ? { from: TFrom["from"] }
        : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
          {})
  : TNoStem["noStem"] extends true
    ? { type: "TEXT"; noStem: true } & (TFrom["from"] extends string
        ? { from: TFrom["from"] }
        : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
          {})
    : TFrom["from"] extends string
      ? { type: "TEXT"; from: TFrom["from"] }
      : "TEXT";

// Internal symbol for build method
const BUILD = Symbol("build");

// Field builders with chainable options
class TextFieldBuilder<
  TNoTokenize extends Record<"noTokenize", boolean> = { noTokenize: false },
  TNoStem extends Record<"noStem", boolean> = { noStem: false },
  TFrom extends Record<"from", string | null> = { from: null },
> {
  private _noTokenize: TNoTokenize;
  private _noStem: TNoStem;
  private _from: TFrom;

  constructor(
    noTokenize = { noTokenize: false } as TNoTokenize,
    noStem = { noStem: false } as TNoStem,
    from = { from: null } as TFrom
  ) {
    this._noTokenize = noTokenize;
    this._noStem = noStem;
    this._from = from;
  }

  noTokenize(): TextFieldBuilder<{ noTokenize: true }, TNoStem, TFrom> {
    return new TextFieldBuilder({ noTokenize: true }, this._noStem, this._from);
  }

  noStem(): TextFieldBuilder<TNoTokenize, { noStem: true }, TFrom> {
    return new TextFieldBuilder(this._noTokenize, { noStem: true }, this._from);
  }

  from(field: string): TextFieldBuilder<TNoTokenize, TNoStem, { from: string }> {
    return new TextFieldBuilder(this._noTokenize, this._noStem, { from: field } as {
      from: string;
    });
  }

  [BUILD](): TextFieldBuild<TNoTokenize, TNoStem, TFrom> {
    return {
      type: "TEXT",
      ...(this._noTokenize.noTokenize ? { noTokenize: true } : {}),
      ...(this._noStem.noStem ? { noStem: true } : {}),
      ...(this._from.from ? { from: this._from.from } : {}),
    } as any;
  }
}

class NumericFieldBuilder<
  T extends NumericField["type"],
  TFrom extends Record<"from", string | null> = { from: null },
> {
  private type: T;
  private _from: TFrom;

  constructor(type: T, from = { from: null } as TFrom) {
    this.type = type;
    this._from = from;
  }

  from(field: string): NumericFieldBuilder<T, { from: string }> {
    return new NumericFieldBuilder(this.type, { from: field } as { from: string });
  }

  [BUILD](): TFrom["from"] extends string
    ? { type: T; fast: true; from: TFrom["from"] }
    : { type: T; fast: true } {
    return this._from.from
      ? ({
          type: this.type,
          fast: true,
          from: this._from.from,
        } as any)
      : ({
          type: this.type,
          fast: true,
        } as any);
  }
}

class BoolFieldBuilder<
  Fast extends Record<"fast", boolean> = { fast: false },
  TFrom extends Record<"from", string | null> = { from: null },
> {
  private _fast: Fast;
  private _from: TFrom;

  constructor(fast = { fast: false } as Fast, from = { from: null } as TFrom) {
    this._fast = fast;
    this._from = from;
  }

  fast(): BoolFieldBuilder<{ fast: true }, TFrom> {
    return new BoolFieldBuilder({ fast: true }, this._from);
  }

  from(field: string): BoolFieldBuilder<Fast, { from: string }> {
    return new BoolFieldBuilder(this._fast, { from: field } as { from: string });
  }

  [BUILD](): Fast extends { fast: true }
    ? TFrom["from"] extends string
      ? { type: "BOOL"; fast: true; from: TFrom["from"] }
      : { type: "BOOL"; fast: true }
    : TFrom["from"] extends string
      ? { type: "BOOL"; from: TFrom["from"] }
      : "BOOL" {
    const hasFast = this._fast.fast;
    const hasFrom = Boolean(this._from.from);

    if (hasFast && hasFrom) {
      return {
        type: "BOOL",
        fast: true,
        from: this._from.from,
      } as any;
    }
    if (hasFast) {
      return {
        type: "BOOL",
        fast: true,
      } as any;
    }
    if (hasFrom) {
      return {
        type: "BOOL",
        from: this._from.from,
      } as any;
    }
    return { type: "BOOL" } as any;
  }
}

class DateFieldBuilder<
  Fast extends Record<"fast", boolean> = { fast: false },
  TFrom extends Record<"from", string | null> = { from: null },
> {
  private _fast: Fast;
  private _from: TFrom;

  constructor(fast = { fast: false } as Fast, from = { from: null } as TFrom) {
    this._fast = fast;
    this._from = from;
  }

  fast(): DateFieldBuilder<{ fast: true }, TFrom> {
    return new DateFieldBuilder({ fast: true }, this._from);
  }

  from(field: string): DateFieldBuilder<Fast, { from: string }> {
    return new DateFieldBuilder(this._fast, { from: field } as { from: string });
  }

  [BUILD](): Fast extends { fast: true }
    ? TFrom["from"] extends string
      ? { type: "DATE"; fast: true; from: TFrom["from"] }
      : { type: "DATE"; fast: true }
    : TFrom["from"] extends string
      ? { type: "DATE"; from: TFrom["from"] }
      : "DATE" {
    const hasFast = this._fast.fast;
    const hasFrom = Boolean(this._from.from);

    if (hasFast && hasFrom) {
      return {
        type: "DATE",
        fast: true,
        from: this._from.from,
      } as any;
    }
    if (hasFast) {
      return {
        type: "DATE",
        fast: true,
      } as any;
    }
    if (hasFrom) {
      return {
        type: "DATE",
        from: this._from.from,
      } as any;
    }
    return { type: "DATE" } as any;
  }
}

type FieldBuilder =
  | TextFieldBuilder<{ noTokenize: boolean }, { noStem: boolean }, { from: string | null }>
  | NumericFieldBuilder<NumericField["type"], { from: string | null }>
  | BoolFieldBuilder<{ fast: boolean }, { from: string | null }>
  | DateFieldBuilder<{ fast: boolean }, { from: string | null }>;

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
      // eslint-disable-next-line unicorn/prefer-ternary
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
