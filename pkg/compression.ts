import { deflateSync, inflateSync } from "bun"

export type SerializedArg = string | number | boolean
type Result = SerializedArg | (SerializedArg | SerializedArg[])[]

type Compress = (commandArg: SerializedArg) => SerializedArg
type Decompress = (result: Result) => Result

const excludedKeyWords = [
  "OK",
  "PONG"
]

export const compressCommandArg: Compress = (commandArg) => {
  switch (typeof commandArg) {
    case "string":
      if (!excludedKeyWords.includes(commandArg)) {
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
      if (!excludedKeyWords.includes(result)) {
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
  "evalsha"
]

export const commandCanBeCompressed = (command: string) => {
  return !excludeCommandList.includes(command)
}
