export type ClientObjectProps = {
  url?: undefined | string;
  token?: undefined | string;
  edgeUrl?: undefined | string;
  readFromEdge?: boolean;
};

export type ReturnType = {
  data: string | number | [] | any;
  error: string | null;
};

export type MethodReturn = Promise<ReturnType>;

export type Callback = (res: ReturnType) => any;

export type RequestConfig =
  | null
  | undefined
  | {
      edge?: boolean;
    };

export type Part = string | boolean | number;

export type Bit = 0 | 1;

export type Infinities = '+inf' | '-inf';

export type ZSetNumber = number | Infinities | string;

type Auth1 = (url?: string, token?: string) => void;
type Auth2 = (options?: ClientObjectProps) => void;

type AppendProps1 = (
  key: string,
  value: string,
  callback?: Callback
) => MethodReturn;
type AppendProps0 = (key: string, value: string) => MethodReturn;

type DecrProps1 = (key: string, callback?: Callback) => MethodReturn;
type DecrProps0 = (key: string) => MethodReturn;

type DecrByProps1 = (
  key: string,
  decrement: number,
  callback?: Callback
) => MethodReturn;
type DecrByProps0 = (key: string, decrement: number) => MethodReturn;

type GetProps2 = (
  key: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type GetProps1 = (key: string, callback?: Callback) => MethodReturn;
type GetProps0 = (key: string) => MethodReturn;

type GetRangeProps2 = (
  key: string,
  start: number,
  end: number,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type GetRangeProps1 = (
  key: string,
  start: number,
  end: number,
  callback?: Callback
) => MethodReturn;
type GetRangeProps0 = (key: string, start: number, end: number) => MethodReturn;

type GetSetProps1 = (
  key: string,
  value: string,
  callback?: Callback
) => MethodReturn;
type GetSetProps0 = (key: string, value: string) => MethodReturn;

type IncrProps1 = (key: string, callback?: Callback) => MethodReturn;
type IncrProps0 = (key: string) => MethodReturn;

type IncrByProps1 = (
  key: string,
  value: number | string,
  callback?: Callback
) => MethodReturn;
type IncrByProps0 = (key: string, value: number | string) => MethodReturn;

type IncrByFloatProps1 = (
  key: string,
  value: number | string,
  callback?: Callback
) => MethodReturn;
type IncrByFloatProps0 = (key: string, value: number | string) => MethodReturn;

type MGetProps2 = (
  values: string[],
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type MGetProps1 = (values: string[], callback?: Callback) => MethodReturn;
type MGetProps0 = (values: string[]) => MethodReturn;

type MSetProps1 = (values: string[], callback?: Callback) => MethodReturn;
type MSetProps0 = (values: string[]) => MethodReturn;

type MSetNxProps1 = (values: string[], callback?: Callback) => MethodReturn;
type MSetNxProps0 = (values: string[]) => MethodReturn;

type PSetExProps1 = (
  key: string,
  miliseconds: number,
  value: string | number,
  callback?: Callback
) => MethodReturn;
type PSetExProps0 = (
  key: string,
  miliseconds: number,
  value: string | number
) => MethodReturn;

type SetProps1 = (
  key: string,
  value: number | string,
  callback?: Callback
) => MethodReturn;
type SetProps0 = (key: string, value: number | string) => MethodReturn;

type SetExProps1 = (
  key: string,
  seconds: number,
  value: string | number,
  callback?: Callback
) => MethodReturn;
type SetExProps0 = (
  key: string,
  seconds: number,
  value: string | number
) => MethodReturn;

type SetNxProps1 = (
  key: string,
  value: string,
  callback?: Callback
) => MethodReturn;
type SetNxProps0 = (key: string, value: string) => MethodReturn;

type SetRangeProps1 = (
  key: string,
  offset: number | string,
  value: string,
  callback?: Callback
) => MethodReturn;
type SetRangeProps0 = (
  key: string,
  offset: number | string,
  value: string
) => MethodReturn;

type StrLenProps2 = (
  key: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type StrLenProps1 = (key: string, callback?: Callback) => MethodReturn;
type StrLenProps0 = (key: string) => MethodReturn;

type BitCountProps2 = (
  key: string,
  start?: number,
  end?: number,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type BitCountProps1 = (
  key: string,
  start?: number,
  end?: number,
  callback?: Callback
) => MethodReturn;
type BitCountProps0 = (
  key: string,
  start?: number,
  end?: number
) => MethodReturn;

type BiTopProps1 = (
  operation: 'AND' | 'OR' | 'XOR' | 'NOT',
  destinationKey: string,
  sourceKeys: string[],
  callback?: Callback
) => MethodReturn;
type BiTopProps0 = (
  operation: 'AND' | 'OR' | 'XOR' | 'NOT',
  destinationKey: string,
  sourceKeys: string[]
) => MethodReturn;

type BitPosProps2 = (
  key: string,
  bit: Bit,
  start?: number,
  end?: number,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type BitPosProps1 = (
  key: string,
  bit: Bit,
  start?: number,
  end?: number,
  callback?: Callback
) => MethodReturn;
type BitPosProps0 = (
  key: string,
  bit: Bit,
  start?: number,
  end?: number
) => MethodReturn;

type GetBitProps2 = (
  key: string,
  offset: number,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type GetBitProps1 = (
  key: string,
  offset: number,
  callback?: Callback
) => MethodReturn;
type GetBitProps0 = (key: string, offset: number) => MethodReturn;

type SetBitProps1 = (
  key: string,
  offset: number,
  value: Bit,
  callback?: Callback
) => MethodReturn;
type SetBitProps0 = (key: string, offset: number, value: Bit) => MethodReturn;

type EchoProps2 = (
  value: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type EchoProps1 = (value: string, callback?: Callback) => MethodReturn;
type EchoProps0 = (value: string) => MethodReturn;

type PingProps2 = (
  value?: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type PingProps1 = (value?: string, callback?: Callback) => MethodReturn;
type PingProps0 = (value?: string) => MethodReturn;

type HDelProps1 = (
  key: string,
  fields: string[],
  callback?: Callback
) => MethodReturn;
type HDelProps0 = (key: string, fields: string[]) => MethodReturn;

type HExistsProps2 = (
  key: string,
  field: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type HExistsProps1 = (
  key: string,
  field: string,
  callback?: Callback
) => MethodReturn;
type HExistsProps0 = (key: string, field: string) => MethodReturn;

type HGetProps2 = (
  key: string,
  field: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type HGetProps1 = (
  key: string,
  field: string,
  callback?: Callback
) => MethodReturn;
type HGetProps0 = (key: string, field: string) => MethodReturn;

type HGetAllProps2 = (
  key: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type HGetAllProps1 = (key: string, callback?: Callback) => MethodReturn;
type HGetAllProps0 = (key: string) => MethodReturn;

type HIncrByProps1 = (
  key: string,
  field: string,
  increment: number | string,
  callback?: Callback
) => MethodReturn;
type HIncrByProps0 = (
  key: string,
  field: string,
  increment: number | string
) => MethodReturn;

type HIncrByFloatProps1 = (
  key: string,
  field: string,
  increment: number | string,
  callback?: Callback
) => MethodReturn;
type HIncrByFloatProps0 = (
  key: string,
  field: string,
  increment: number | string
) => MethodReturn;

type HKeysProps2 = (
  key: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type HKeysProps1 = (key: string, callback?: Callback) => MethodReturn;
type HKeysProps0 = (key: string) => MethodReturn;

type HLenProps2 = (
  key: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type HLenProps1 = (key: string, callback?: Callback) => MethodReturn;
type HLenProps0 = (key: string) => MethodReturn;

type HmGetProps2 = (
  key: string,
  fields: string[],
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type HmGetProps1 = (
  key: string,
  fields: string[],
  callback?: Callback
) => MethodReturn;
type HmGetProps0 = (key: string, fields: string[]) => MethodReturn;

type HmSetProps1 = (
  key: string,
  values: string[],
  callback?: Callback
) => MethodReturn;
type HmSetProps0 = (key: string, values: string[]) => MethodReturn;

type HScanProps1 = (
  key: string,
  cursor: number,
  options?: { match?: number | string; count?: number | string },
  callback?: Callback
) => MethodReturn;
type HScanProps0 = (
  key: string,
  cursor: number,
  options?: { match?: number | string; count?: number | string }
) => MethodReturn;

type HSetProps1 = (
  key: string,
  values: string[],
  callback?: Callback
) => MethodReturn;
type HSetProps0 = (key: string, values: string[]) => MethodReturn;

type HSetNxProps1 = (
  key: string,
  field: string,
  value: string,
  callback?: Callback
) => MethodReturn;
type HSetNxProps0 = (key: string, field: string, value: string) => MethodReturn;

type HValsProps2 = (
  key: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type HValsProps1 = (key: string, callback?: Callback) => MethodReturn;
type HValsProps0 = (key: string) => MethodReturn;

type DelProps1 = (keys: string[], callback?: Callback) => MethodReturn;
type DelProps0 = (keys: string[]) => MethodReturn;

type ExistsProps2 = (
  keys: string[],
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type ExistsProps1 = (keys: string[], callback?: Callback) => MethodReturn;
type ExistsProps0 = (keys: string[]) => MethodReturn;

type ExpireProps1 = (
  key: string,
  seconds: number,
  callback?: Callback
) => MethodReturn;
type ExpireProps0 = (key: string, seconds: number) => MethodReturn;

type ExpireAtProps1 = (
  key: string,
  timestamp: number | string,
  callback?: Callback
) => MethodReturn;
type ExpireAtProps0 = (key: string, timestamp: number | string) => MethodReturn;

type KeysProps2 = (
  pattern: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type KeysProps1 = (pattern: string, callback?: Callback) => MethodReturn;
type KeysProps0 = (pattern: string) => MethodReturn;

type PersistProps1 = (key: string, callback?: Callback) => MethodReturn;
type PersistProps0 = (key: string) => MethodReturn;

type PExpireProps1 = (
  key: string,
  miliseconds: number,
  callback?: Callback
) => MethodReturn;
type PExpireProps0 = (key: string, miliseconds: number) => MethodReturn;

type PTTLProps2 = (
  key: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type PTTLProps1 = (key: string, callback?: Callback) => MethodReturn;
type PTTLProps0 = (key: string) => MethodReturn;

type RandomKeyProps1 = (callback?: Callback) => MethodReturn;
type RandomKeyProps0 = () => MethodReturn;

type RenameProps1 = (
  key: string,
  newKey: string,
  callback?: Callback
) => MethodReturn;
type RenameProps0 = (key: string, newKey: string) => MethodReturn;

type RenameNxProps1 = (
  key: string,
  newKey: string,
  callback?: Callback
) => MethodReturn;
type RenameNxProps0 = (key: string, newKey: string) => MethodReturn;

type ScanProps1 = (
  cursor: number,
  opitons?: { match?: number | string; count?: number | string },
  callback?: Callback
) => MethodReturn;
type ScanProps0 = (
  cursor: number,
  opitons?: { match?: number | string; count?: number | string }
) => MethodReturn;

type TouchProps1 = (keys: string[], callback?: Callback) => MethodReturn;
type TouchProps0 = (keys: string[]) => MethodReturn;

type TTLProps2 = (
  key: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type TTLProps1 = (key: string, callback?: Callback) => MethodReturn;
type TTLProps0 = (key: string) => MethodReturn;

type TypeProps2 = (
  key: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type TypeProps1 = (key: string, callback?: Callback) => MethodReturn;
type TypeProps0 = (key: string) => MethodReturn;

type UnlinkProps1 = (keys: string[], callback?: Callback) => MethodReturn;
type UnlinkProps0 = (keys: string[]) => MethodReturn;

type LIndexProps2 = (
  key: string,
  index: number,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type LIndexProps1 = (
  key: string,
  index: number,
  callback?: Callback
) => MethodReturn;
type LIndexProps0 = (key: string, index: number) => MethodReturn;

type LInsertProps1 = (
  key: string,
  option: 'BEFORE' | 'AFTER',
  pivot: string,
  element: string,
  callback?: Callback
) => MethodReturn;
type LInsertProps0 = (
  key: string,
  option: 'BEFORE' | 'AFTER',
  pivot: string,
  element: string
) => MethodReturn;

type LLenProps2 = (
  key: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type LLenProps1 = (key: string, callback?: Callback) => MethodReturn;
type LLenProps0 = (key: string) => MethodReturn;

type LPopProps1 = (key: string, callback?: Callback) => MethodReturn;
type LPopProps0 = (key: string) => MethodReturn;

type LPushProps1 = (
  key: string,
  elements: string[],
  callback?: Callback
) => MethodReturn;
type LPushProps0 = (key: string, elements: string[]) => MethodReturn;

type LRangeProps2 = (
  key: string,
  start: number,
  stop: number,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type LRangeProps1 = (
  key: string,
  start: number,
  stop: number,
  callback?: Callback
) => MethodReturn;
type LRangeProps0 = (key: string, start: number, stop: number) => MethodReturn;

type LRemProps1 = (
  key: string,
  count: number,
  element: string,
  callback?: Callback
) => MethodReturn;
type LRemProps0 = (key: string, count: number, element: string) => MethodReturn;

type LSetProps1 = (
  key: string,
  index: number,
  element: string,
  callback?: Callback
) => MethodReturn;
type LSetProps0 = (key: string, index: number, element: string) => MethodReturn;

type LTrimProps1 = (
  key: string,
  start: number,
  stop: number,
  callback?: Callback
) => MethodReturn;
type LTrimProps0 = (key: string, start: number, stop: number) => MethodReturn;

type RPopProps1 = (key: string, callback?: Callback) => MethodReturn;
type RPopProps0 = (key: string) => MethodReturn;

type RPopLPushProps1 = (
  source: string,
  destination: string,
  callback?: Callback
) => MethodReturn;
type RPopLPushProps0 = (source: string, destination: string) => MethodReturn;

type RPushProps1 = (
  key: string,
  elements: string[],
  callback?: Callback
) => MethodReturn;
type RPushProps0 = (key: string, elements: string[]) => MethodReturn;

type DBSizeProps2 = (
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type DBSizeProps1 = (callback?: Callback) => MethodReturn;
type DBSizeProps0 = () => MethodReturn;

type FlushAllProps1 = (mode?: 'ASYNC', callback?: Callback) => MethodReturn;
type FlushAllProps0 = (mode?: 'ASYNC') => MethodReturn;

type InfoProps2 = (config?: RequestConfig, callback?: Callback) => MethodReturn;
type InfoProps1 = (callback?: Callback) => MethodReturn;
type InfoProps0 = () => MethodReturn;

type TimeProps1 = (callback?: Callback) => MethodReturn;
type TimeProps0 = () => MethodReturn;

type SAddProps1 = (
  key: string,
  members: string[],
  callback?: Callback
) => MethodReturn;
type SAddProps0 = (key: string, members: string[]) => MethodReturn;

type SCardProps1 = (key: string, callback?: Callback) => MethodReturn;
type SCardProps0 = (key: string) => MethodReturn;

type SDiffProps2 = (
  keys: string[],
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type SDiffProps1 = (keys: string[], callback?: Callback) => MethodReturn;
type SDiffProps0 = (keys: string[]) => MethodReturn;

type SDiffStoreProps1 = (
  destination: string,
  keys: string[],
  callback?: Callback
) => MethodReturn;
type SDiffStoreProps0 = (destination: string, keys: string[]) => MethodReturn;

type SInterProps2 = (
  keys: string[],
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type SInterProps1 = (keys: string[], callback?: Callback) => MethodReturn;
type SInterProps0 = (keys: string[]) => MethodReturn;

type SInterStoreProps1 = (
  destination: string,
  keys: string[],
  callback?: Callback
) => MethodReturn;
type SInterStoreProps0 = (destination: string, keys: string[]) => MethodReturn;

type SIsMemberProps2 = (
  key: string,
  member: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type SIsMemberProps1 = (
  key: string,
  member: string,
  callback?: Callback
) => MethodReturn;
type SIsMemberProps0 = (key: string, member: string) => MethodReturn;

type SMembersProps2 = (
  key: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type SMembersProps1 = (key: string, callback?: Callback) => MethodReturn;
type SMembersProps0 = (key: string) => MethodReturn;

type SMoveProps1 = (
  source: string,
  destination: string,
  member: string,
  callback?: Callback
) => MethodReturn;
type SMoveProps0 = (
  source: string,
  destination: string,
  member: string
) => MethodReturn;

type SPopProps1 = (
  key: string,
  count?: number,
  callback?: Callback
) => MethodReturn;
type SPopProps0 = (key: string, count?: number) => MethodReturn;

type SRandMemberProps2 = (
  key: string,
  count?: number,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type SRandMemberProps1 = (
  key: string,
  count?: number,
  callback?: Callback
) => MethodReturn;
type SRandMemberProps0 = (key: string, count?: number) => MethodReturn;

type SRemProps1 = (
  key: string,
  members: string[],
  callback?: Callback
) => MethodReturn;
type SRemProps0 = (key: string, members: string[]) => MethodReturn;

type SUnionProps2 = (
  keys: string[],
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type SUnionProps1 = (keys: string[], callback?: Callback) => MethodReturn;
type SUnionProps0 = (keys: string[]) => MethodReturn;

type SUnionStoreProps1 = (
  destination: string,
  keys: string[],
  callback?: Callback
) => MethodReturn;
type SUnionStoreProps0 = (destination: string, keys: string[]) => MethodReturn;

type ZAddProps1 = (
  key: string,
  values: ZSetNumber[],
  options?: ({ xx?: boolean } | { nx?: boolean }) & {
    ch?: boolean;
    incr: boolean;
  },
  callback?: Callback
) => MethodReturn;
type ZAddProps0 = (
  key: string,
  values: ZSetNumber[],
  options?: ({ xx?: boolean } | { nx?: boolean }) & {
    ch?: boolean;
    incr: boolean;
  }
) => MethodReturn;

type ZCardProps2 = (
  key: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type ZCardProps1 = (key: string, callback?: Callback) => MethodReturn;
type ZCardProps0 = (key: string) => MethodReturn;

type ZCountProps2 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type ZCountProps1 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  callback?: Callback
) => MethodReturn;
type ZCountProps0 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber
) => MethodReturn;

type ZIncrByProps1 = (
  key: string,
  increment: number | string,
  member: string,
  callback?: Callback
) => MethodReturn;
type ZIncrByProps0 = (
  key: string,
  increment: number | string,
  member: string
) => MethodReturn;

type ZInterStoreProps1 = (
  destination: string,
  keys: string[],
  options?: { weights?: number[]; aggregate?: 'MIN' | 'MAX' | 'SUM' },
  callback?: Callback
) => MethodReturn;
type ZInterStoreProps0 = (
  destination: string,
  keys: string[],
  options?: { weights?: number[]; aggregate?: 'MIN' | 'MAX' | 'SUM' }
) => MethodReturn;

type ZLexCountProps2 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type ZLexCountProps1 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  callback?: Callback
) => MethodReturn;
type ZLexCountProps0 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber
) => MethodReturn;

type ZPopMaxProps1 = (
  key: string,
  count?: number,
  callback?: Callback
) => MethodReturn;
type ZPopMaxProps0 = (key: string, count?: number) => MethodReturn;

type ZRangeProps2 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  options?: { withScores: boolean },
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type ZRangeProps1 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  options?: { withScores: boolean },
  callback?: Callback
) => MethodReturn;
type ZRangeProps0 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  options?: { withScores: boolean }
) => MethodReturn;

type ZRangeByLexProps2 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  offset?: number,
  count?: number,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type ZRangeByLexProps1 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  offset?: number,
  count?: number,
  callback?: Callback
) => MethodReturn;
type ZRangeByLexProps0 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  offset?: number,
  count?: number
) => MethodReturn;

type ZRangeByScoreProps2 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  options?: {
    withScores?: boolean;
    limit?: { offset: number; count: number };
  },
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type ZRangeByScoreProps1 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  options?: {
    withScores?: boolean;
    limit?: { offset: number; count: number };
  },
  callback?: Callback
) => MethodReturn;
type ZRangeByScoreProps0 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  options?: {
    withScores?: boolean;
    limit?: { offset: number; count: number };
  }
) => MethodReturn;

type ZRankProps2 = (
  key: string,
  member: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type ZRankProps1 = (
  key: string,
  member: string,
  callback?: Callback
) => MethodReturn;
type ZRankProps0 = (key: string, member: string) => MethodReturn;

type ZRemProps1 = (
  key: string,
  members: string[],
  callback?: Callback
) => MethodReturn;
type ZRemProps0 = (key: string, members: string[]) => MethodReturn;

type ZRemRangeByLexProps1 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  callback?: Callback
) => MethodReturn;
type ZRemRangeByLexProps0 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber
) => MethodReturn;

type ZRemRangeByRankProps1 = (
  key: string,
  start: number,
  stop: number,
  callback?: Callback
) => MethodReturn;
type ZRemRangeByRankProps0 = (
  key: string,
  start: number,
  stop: number
) => MethodReturn;

type ZRemRangeByScoreProps1 = (
  key: string,
  start: number,
  stop: number,
  callback?: Callback
) => MethodReturn;
type ZRemRangeByScoreProps0 = (
  key: string,
  start: number,
  stop: number
) => MethodReturn;

type ZRevRangeProps2 = (
  key: string,
  start: number,
  stop: number,
  options?: { withScores: boolean },
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type ZRevRangeProps1 = (
  key: string,
  start: number,
  stop: number,
  options?: { withScores: boolean },
  callback?: Callback
) => MethodReturn;
type ZRevRangeProps0 = (
  key: string,
  start: number,
  stop: number,
  options?: { withScores: boolean }
) => MethodReturn;

type ZRevRangeByLexProps2 = (
  key: string,
  max: ZSetNumber,
  min: ZSetNumber,
  offset?: number,
  count?: number,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type ZRevRangeByLexProps1 = (
  key: string,
  max: ZSetNumber,
  min: ZSetNumber,
  offset?: number,
  count?: number,
  callback?: Callback
) => MethodReturn;
type ZRevRangeByLexProps0 = (
  key: string,
  max: ZSetNumber,
  min: ZSetNumber,
  offset?: number,
  count?: number
) => MethodReturn;

type ZRevRangeByScoreProps2 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type ZRevRangeByScoreProps1 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  callback?: Callback
) => MethodReturn;
type ZRevRangeByScoreProps0 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber
) => MethodReturn;

type ZRevRankProps2 = (
  key: string,
  member: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type ZRevRankProps1 = (
  key: string,
  member: string,
  callback?: Callback
) => MethodReturn;
type ZRevRankProps0 = (key: string, member: string) => MethodReturn;

type ZScoreProps2 = (
  key: string,
  member: string,
  config?: RequestConfig,
  callback?: Callback
) => MethodReturn;
type ZScoreProps1 = (
  key: string,
  member: string,
  callback?: Callback
) => MethodReturn;
type ZScoreProps0 = (key: string, member: string) => MethodReturn;

type ZUnionStoreProps1 = (
  destination: string,
  keys: string[],
  options?: { weights?: number[]; aggregate?: 'MIN' | 'MAX' | 'SUM' },
  callback?: Callback
) => MethodReturn;
type ZUnionStoreProps0 = (
  destination: string,
  keys: string[],
  options?: { weights?: number[]; aggregate?: 'MIN' | 'MAX' | 'SUM' }
) => MethodReturn;

export type Upstash = {
  auth: Auth1 & Auth2;
  //
  append: AppendProps1 & AppendProps0;
  decr: DecrProps1 & DecrProps0;
  decrby: DecrByProps1 & DecrByProps0;
  get: GetProps2 & GetProps1 & GetProps0;
  getrange: GetRangeProps2 & GetRangeProps1 & GetRangeProps0;
  getset: GetSetProps1 & GetSetProps0;
  incr: IncrProps1 & IncrProps0;
  incrby: IncrByProps1 & IncrByProps0;
  incrbyfloat: IncrByFloatProps1 & IncrByFloatProps0;
  mget: MGetProps2 & MGetProps1 & MGetProps0;
  mset: MSetProps1 & MSetProps0;
  msetnx: MSetNxProps1 & MSetNxProps0;
  psetex: PSetExProps1 & PSetExProps0;
  set: SetProps1 & SetProps0;
  setex: SetExProps1 & SetExProps0;
  setnx: SetNxProps1 & SetNxProps0;
  setrange: SetRangeProps1 & SetRangeProps0;
  strlen: StrLenProps2 & StrLenProps1 & StrLenProps0;
  //
  bitcount: BitCountProps2 & BitCountProps1 & BitCountProps0;
  bitop: BiTopProps1 & BiTopProps0;
  bitpos: BitPosProps2 & BitPosProps1 & BitPosProps0;
  getbit: GetBitProps2 & GetBitProps1 & GetBitProps0;
  setbit: SetBitProps1 & SetBitProps0;
  //
  echo: EchoProps2 & EchoProps1 & EchoProps0;
  ping: PingProps2 & PingProps1 & PingProps0;
  //
  hdel: HDelProps1 & HDelProps0;
  hexists: HExistsProps2 & HExistsProps1 & HExistsProps0;
  hget: HGetProps2 & HGetProps1 & HGetProps0;
  hgetall: HGetAllProps2 & HGetAllProps1 & HGetAllProps0;
  hincrby: HIncrByProps1 & HIncrByProps0;
  hincrbyfloat: HIncrByFloatProps1 & HIncrByFloatProps0;
  hkeys: HKeysProps2 & HKeysProps1 & HKeysProps0;
  hlen: HLenProps2 & HLenProps1 & HLenProps0;
  hmget: HmGetProps2 & HmGetProps1 & HmGetProps0;
  hmset: HmSetProps1 & HmSetProps0;
  hscan: HScanProps1 & HScanProps0;
  hset: HSetProps1 & HSetProps0;
  hsetnx: HSetNxProps1 & HSetNxProps0;
  hvals: HValsProps2 & HValsProps1 & HValsProps0;
  //
  del: DelProps1 & DelProps0;
  exists: ExistsProps2 & ExistsProps1 & ExistsProps0;
  expire: ExpireProps1 & ExpireProps0;
  expireat: ExpireAtProps1 & ExpireAtProps0;
  keys: KeysProps2 & KeysProps1 & KeysProps0;
  persist: PersistProps1 & PersistProps0;
  pexpire: PExpireProps1 & PExpireProps0;
  pexpireat: PExpireProps1 & PExpireProps0;
  pttl: PTTLProps2 & PTTLProps1 & PTTLProps0;
  randomkey: RandomKeyProps1 & RandomKeyProps0;
  rename: RenameProps1 & RenameProps0;
  renamenx: RenameNxProps1 & RenameNxProps0;
  scan: ScanProps1 & ScanProps0;
  touch: TouchProps1 & TouchProps0;
  ttl: TTLProps2 & TTLProps1 & TTLProps0;
  type: TypeProps2 & TypeProps1 & TypeProps0;
  unlink: UnlinkProps1 & UnlinkProps0;
  //
  lindex: LIndexProps2 & LIndexProps1 & LIndexProps0;
  linsert: LInsertProps1 & LInsertProps0;
  llen: LLenProps2 & LLenProps1 & LLenProps0;
  lpop: LPopProps1 & LPopProps0;
  lpush: LPushProps1 & LPushProps0;
  lpushx: LPushProps1 & LPushProps0;
  lrange: LRangeProps2 & LRangeProps1 & LRangeProps0;
  lrem: LRemProps1 & LRemProps0;
  lset: LSetProps1 & LSetProps0;
  ltrim: LTrimProps1 & LTrimProps0;
  rpop: RPopProps1 & RPopProps0;
  rpoplpush: RPopLPushProps1 & RPopLPushProps0;
  rpush: RPushProps1 & RPushProps0;
  rpushx: RPushProps1 & RPushProps0;
  //
  dbsize: DBSizeProps2 & DBSizeProps1 & DBSizeProps0;
  flushall: FlushAllProps1 & FlushAllProps0;
  flushdb: FlushAllProps1 & FlushAllProps0;
  info: InfoProps2 & InfoProps1 & InfoProps0;
  time: TimeProps1 & TimeProps0;
  //
  sadd: SAddProps1 & SAddProps0;
  scard: SCardProps1 & SCardProps0;
  sdiff: SDiffProps2 & SDiffProps1 & SDiffProps0;
  sdiffstore: SDiffStoreProps1 & SDiffStoreProps0;
  sinter: SInterProps2 & SInterProps1 & SInterProps0;
  sinterstore: SInterStoreProps1 & SInterStoreProps0;
  sismember: SIsMemberProps2 & SIsMemberProps1 & SIsMemberProps0;
  smembers: SMembersProps2 & SMembersProps1 & SMembersProps0;
  smove: SMoveProps1 & SMoveProps0;
  spop: SPopProps1 & SPopProps0;
  srandmember: SRandMemberProps2 & SRandMemberProps1 & SRandMemberProps0;
  srem: SRemProps1 & SRemProps0;
  sunion: SUnionProps2 & SUnionProps1 & SUnionProps0;
  sunionstore: SUnionStoreProps1 & SUnionStoreProps0;
  //
  zadd: ZAddProps1 & ZAddProps0;
  zcard: ZCardProps2 & ZCardProps1 & ZCardProps0;
  zcount: ZCountProps2 & ZCountProps1 & ZCountProps0;
  zincrby: ZIncrByProps1 & ZIncrByProps0;
  zinterstore: ZInterStoreProps1 & ZInterStoreProps0;
  zlexcount: ZLexCountProps2 & ZLexCountProps1 & ZLexCountProps0;
  zpopmax: ZPopMaxProps1 & ZPopMaxProps0;
  zpopmin: ZPopMaxProps1 & ZPopMaxProps0;
  zrange: ZRangeProps2 & ZRangeProps1 & ZRangeProps0;
  zrangebylex: ZRangeByLexProps2 & ZRangeByLexProps1 & ZRangeByLexProps0;
  zrangebyscore: ZRangeByScoreProps2 &
    ZRangeByScoreProps1 &
    ZRangeByScoreProps0;
  zrank: ZRankProps2 & ZRankProps1 & ZRankProps0;
  zrem: ZRemProps1 & ZRemProps0;
  zremrangebylex: ZRemRangeByLexProps1 & ZRemRangeByLexProps0;
  zremrangebyrank: ZRemRangeByRankProps1 & ZRemRangeByRankProps0;
  zremrangebyscore: ZRemRangeByScoreProps1 & ZRemRangeByScoreProps0;
  zrevrange: ZRevRangeProps2 & ZRevRangeProps1 & ZRevRangeProps0;
  zrevrangebylex: ZRevRangeByLexProps2 &
    ZRevRangeByLexProps1 &
    ZRevRangeByLexProps0;
  zrevrangebyscore: ZRevRangeByScoreProps2 &
    ZRevRangeByScoreProps1 &
    ZRevRangeByScoreProps0;
  zrevrank: ZRevRankProps2 & ZRevRankProps1 & ZRevRankProps0;
  zscore: ZScoreProps2 & ZScoreProps1 & ZScoreProps0;
  zunionstore: ZUnionStoreProps1 & ZUnionStoreProps0;
};
