import { Command } from "../command"

/**
 * @see https://redis.io/commands/copy
 */
export class CopyCommand extends Command<0 | 1> {
  constructor(source: string, destination: string) {
    super(["copy", source, destination])
  }
}
/**
 * @see https://redis.io/commands/del
 */
export class DelCommand extends Command<number> {
  constructor(...keys: string[]) {
    super(["del", ...keys])
  }
}

/**
 * @see https://redis.io/commands/exists
 */
export class ExistsCommand extends Command<number> {
  constructor(...keys: string[]) {
    super(["exists", ...keys])
  }
}
/**
 * @see https://redis.io/commands/expire
 */
export class ExpireCommand extends Command<0 | 1> {
  constructor(key: string, seconds: number, opts?: "nx" | "xx" | "gt" | "lt") {
    const command = ["expire", key, seconds]
    if (opts) {
      command.push(opts)
    }
    super(command)
  }
}

/**
 * @see https://redis.io/commands/expireat
 */
export class ExpireAtCommand extends Command<0 | 1> {
  constructor(key: string, unix: number, opts?: "nx" | "xx" | "gt" | "lt") {
    const command = ["expireat", key, unix]
    if (opts) {
      command.push(opts)
    }
    super(command)
  }
}

/**
 * @see https://redis.io/commands/keys
 */
export class KeysCommand extends Command<string[]> {
  constructor(pattern: string) {
    super(["keys", pattern])
  }
}

/**
 * @see https://redis.io/commands/persist
 */
export class PersistCommand extends Command<0 | 1> {
  constructor(key: string) {
    super(["persist", key])
  }
}

/**
 * @see https://redis.io/commands/pexpire
 */
export class PExpireCommand extends Command<0 | 1> {
  constructor(key: string, milliseconds: number, opts?: "nx" | "xx" | "gt" | "lt") {
    const command = ["pexpire", key, milliseconds]
    if (opts) {
      command.push(opts)
    }
    super(command)
  }
}

/**
 * @see https://redis.io/commands/pexpireat
 */
export class PExpireAtCommand extends Command<0 | 1> {
  constructor(key: string, unix: number, opts?: "nx" | "xx" | "gt" | "lt") {
    const command = ["pexpireat", key, unix]
    if (opts) {
      command.push(opts)
    }
    super(command)
  }
}

/**
 * @see https://redis.io/commands/pttl
 */
export class PTtlxpireCommand extends Command<number> {
  constructor(key: string) {
    super(["pttl", key])
  }
}
/**
 * @see https://redis.io/commands/randomkey
 */
export class RandomKeyCommand extends Command<string | null> {
  constructor() {
    super(["randomkey"])
  }
}

/**
 * @see https://redis.io/commands/rename
 */
export class RenameCommand extends Command<string> {
  constructor(source: string, destination: string) {
    super(["reame", source, destination])
  }
}

/**
 * @see https://redis.io/commands/renamenx
 */
export class RenameNXCommand extends Command<0 | 1> {
  constructor(source: string, destination: string) {
    super(["reamenx", source, destination])
  }
}

/**
 * @see https://redis.io/commands/scan
 */
export class ScanCommand extends Command<[number, string[]]> {
  constructor(pattern: string, cursor: number) {
    super(["scan", pattern, cursor])
  }
}

/**
 * @see https://redis.io/commands/touch
 */
export class TouchCommand extends Command<number> {
  constructor(...keys: string[]) {
    super(["touch", ...keys])
  }
}

/**
 * @see https://redis.io/commands/ttl
 */
export class TtlCommand extends Command<number> {
  constructor(key: string) {
    super(["ttl", key])
  }
}

/**
 * @see https://redis.io/commands/type
 */
export class TypeCommand extends Command<"string" | "list" | "set" | "zset" | "hash" | "stream"> {
  constructor(key: string) {
    super(["type", key])
  }
}

/**
 * @see https://redis.io/commands/unlink
 */
export class UnlinkCommand extends Command<number> {
  constructor(...keys: string[]) {
    super(["unlink", ...keys])
  }
}
