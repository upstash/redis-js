import { Command } from "../command";

/**
 * @see https://redis.io/commands/append
 */
export class AppendCommand extends Command<number> {
  constructor(key: string, value: string) {
    super(["append", key, value]);
  }
}

/**
 * @see https://redis.io/commands/decr
 */
export class DecrCommand extends Command<number> {
  constructor(key: string) {
    super(["decr", key]);
  }
}

/**
 * @see https://redis.io/commands/decrby
 */
export class DecrByCommand extends Command<number> {
  constructor(key: string, value: number) {
    super(["decrby", key, value]);
  }
}

/**
 * @see https://redis.io/commands/get
 */
export class GetCommand<TData = string> extends Command<TData> {
  constructor(key: string) {
    super(["get", key]);
  }
}

/**
 * @see https://redis.io/commands/getrange
 */
export class GetRangeCommand extends Command<string> {
  constructor(key: string, start: number, end: number) {
    super(["getrange", key, start, end]);
  }
}

/**
 * @see https://redis.io/commands/getset
 */
export class GetSetCommand<TData = string> extends Command<TData> {
  constructor(key: string, value: TData) {
    super(["getset", key, value]);
  }
}

/**
 * @see https://redis.io/commands/incr
 */
export class IncrCommand extends Command<number> {
  constructor(key: string) {
    super(["incr", key]);
  }
}

/**
 * @see https://redis.io/commands/incrby
 */
export class IncrByCommand extends Command<number> {
  constructor(key: string, value: number) {
    super(["incrby", key, value]);
  }
}
/**
 * @see https://redis.io/commands/incrbyfloat
 */
export class IncrByFloatCommand extends Command<number> {
  constructor(key: string, value: number) {
    super(["incrbyfloat", key, value]);
  }
}
/**
 * @see https://redis.io/commands/mget
 */
export class MGetCommand<TData = string> extends Command<TData[]> {
  constructor(...keys: string[]) {
    super(["mget", ...keys]);
  }
}

/**
 * @see https://redis.io/commands/mset
 */
export class MSetCommand<TData = string> extends Command<string> {
  constructor(...kvPairs: { key: string; value: TData }[]) {
    super(["mset", ...kvPairs.flatMap(({ key, value }) => [key, value])]);
  }
}

/**
 * @see https://redis.io/commands/msetnx
 */
export class MSetNXCommand<TData = string> extends Command<number> {
  constructor(...kvPairs: { key: string; value: TData }[]) {
    super(["msetnx", ...kvPairs.flatMap(({ key, value }) => [key, value])]);
  }
}

/**
 * @see https://redis.io/commands/psetex
 */
export class PSetEXCommand<TData = string> extends Command<string> {
  constructor(key: string, ttl: number, value: TData) {
    super(["psetex", key, ttl, value]);
  }
}

export type SetCommandOptions = (
  | {
      ex: number;
    }
  | {
      px: number;
    }
  | {
      exat: number;
    }
  | {
      pxat: number;
    }
  | { keepttl: boolean }
) &
  (
    | {
        nx: boolean;
      }
    | {
        xx: boolean;
      }
  ) & { get: boolean };

/**
 * @see https://redis.io/commands/set
 */
export class SetCommand<
  TData = string,
  TResult = string
> extends Command<TResult> {
  constructor(key: string, value: TData, opts?: SetCommandOptions) {
    const command = ["set", key, value];
    if (opts) {
      if ("ex" in opts) {
        command.push("ex", opts.ex.toString());
      }
      if ("px" in opts) {
        command.push("px", opts.px.toString());
      }
      if ("exat" in opts) {
        command.push("exat", opts.exat.toString());
      }
      if ("pxat" in opts) {
        command.push("pxat", opts.pxat.toString());
      }
      if ("keepttl" in opts) {
        command.push("keepttl");
      }

      if ("nx" in opts) {
        command.push("nx");
      } else if ("xx" in opts) {
        command.push("xx");
      }
      if ("get" in opts) {
        command.push("get");
      }
    }
    super(command);
  }
}

/**
 * @see https://redis.io/commands/setex
 */
export class SetExCommand<TData = string> extends Command<string> {
  constructor(key: string, ttl: number, value: TData) {
    super(["setex", key, ttl, value]);
  }
}

/**
 * @see https://redis.io/commands/setnx
 */
export class SetNxCommand<TData = string> extends Command<number> {
  constructor(key: string, value: TData) {
    super(["setnx", key, value]);
  }
}

/**
 * @see https://redis.io/commands/setrange
 */
export class SetRangeCommand extends Command<number> {
  constructor(key: string, offset: number, value: string) {
    super(["setrange", key, offset, value]);
  }
}

/**
 * @see https://redis.io/commands/strlen
 */
export class StrLenCommand extends Command<number> {
  constructor(key: string) {
    super(["strlen", key]);
  }
}
