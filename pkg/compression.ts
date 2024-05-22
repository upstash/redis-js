import { deflateSync, inflateSync } from "bun"

export type SerializedArg = string | number | boolean
type Result = SerializedArg | (SerializedArg | SerializedArg[])[]

type Compress = (commandArg: SerializedArg) => SerializedArg
type Decompress = (result: Result) => Result

const excludedKeyWords = [
  "OK",
  "PONG",
  "MATCH", // https://redis.io/docs/latest/commands/hscan/
  "NX", // https://redis.io/docs/latest/commands/geoadd/
  "XX",
  "CH",
  "FROMMEMBER", // https://redis.io/docs/latest/commands/geosearchstore/
  "FROMLONLAT",
  "BYRADIUS",
  "M",
  "KM",
  "FT",
  "MI",
  "BYBOX",
  "ASC",
  "DESC",
  "COUNT",
  "ANY",
  "STOREDIST",
  "BYSCORE", // https://redis.io/docs/latest/commands/zrange/
  "BYLEX",
  "REV",
  "LIMIT",
  "WITHSCORES"
]

export const compressCommandArg: Compress = (commandArg) => {
  switch (typeof commandArg) {
    case "string":
      if (!excludedKeyWords.includes(commandArg.toUpperCase())) {
        return deflateSync(commandArg).toString();
      };
    default:
      return commandArg;
  }
}

export const decompressCommandArg: Decompress = (result) => {
  if (Array.isArray(result)) {
    return result.map(decompressCommandArg) as SerializedArg[]
  }

  switch (typeof result) {
    case "string":
      if (!excludedKeyWords.includes(result.toUpperCase())) {
        const data = inflateSync(
          new Uint8Array(
            result.split(',').map(Number)
          )
        )
        return new TextDecoder().decode(data)
      };
      return result
    default:
      return result;
  }
}

const excludeCommandList = [
  "script",
  "eval",
  "evalsha",
  "json.set",

]

export const commandCanBeCompressed = (command: string) => {
  return !excludeCommandList.includes(command.toLowerCase())
}
