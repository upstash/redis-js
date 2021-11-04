export type ClientObjectProps =
  | {
      url: string;
      token: string;
      edgeUrl?: never;
      readFromEdge?: never;
    }
  | {
      url: string;
      token: string;
      edgeUrl: string;
      readFromEdge: boolean;
    };

export type EdgeCacheType = null | 'miss' | 'hit';

export type ReturnType = {
  data: string | number | [] | any;
  error: string | null;
  metadata?: { edge: boolean; cache: EdgeCacheType };
};

export type MethodReturn = Promise<ReturnType>;

export type Callback = (res: ReturnType) => any;

export type RequestConfig =
  | false
  | undefined
  | {
      edge?: boolean;
    };

export type Part = string | boolean | number;

export type Bit = 0 | 1;

export type Infinities = '+inf' | '-inf';

export type ZSetNumber = Infinities | number | string;

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
  min: ZSetNumber,
  max: ZSetNumber,
  callback?: Callback
) => MethodReturn;
type ZRemRangeByScoreProps0 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber
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
  append: AppendProps0 & AppendProps1;
  decr: DecrProps0 & DecrProps1;
  decrby: DecrByProps0 & DecrByProps1;
  get: GetProps0 & GetProps2 & GetProps1;
  getrange: GetRangeProps0 & GetRangeProps1 & GetRangeProps2;
  getset: GetSetProps0 & GetSetProps1;
  incr: IncrProps0 & IncrProps1;
  incrby: IncrByProps0 & IncrByProps1;
  incrbyfloat: IncrByFloatProps0 & IncrByFloatProps1;
  mget: MGetProps0 & MGetProps1 & MGetProps2;
  mset: MSetProps0 & MSetProps1;
  msetnx: MSetNxProps0 & MSetNxProps1;
  psetex: PSetExProps0 & PSetExProps1;
  set: SetProps0 & SetProps1;
  setex: SetExProps0 & SetExProps1;
  setnx: SetNxProps0 & SetNxProps1;
  setrange: SetRangeProps0 & SetRangeProps1;
  strlen: StrLenProps0 & StrLenProps1 & StrLenProps2;
  //
  bitcount: BitCountProps0 & BitCountProps1 & BitCountProps2;
  bitop: BiTopProps0 & BiTopProps1;
  bitpos: BitPosProps0 & BitPosProps1 & BitPosProps2;
  getbit: GetBitProps0 & GetBitProps1 & GetBitProps2;
  setbit: SetBitProps0 & SetBitProps1;
  //
  echo: EchoProps0 & EchoProps1 & EchoProps2;
  ping: PingProps0 & PingProps1 & PingProps2;
  //
  hdel: HDelProps0 & HDelProps1;
  hexists: HExistsProps0 & HExistsProps1 & HExistsProps2;
  hget: HGetProps0 & HGetProps1 & HGetProps2;
  hgetall: HGetAllProps0 & HGetAllProps1 & HGetAllProps2;
  hincrby: HIncrByProps0 & HIncrByProps1;
  hincrbyfloat: HIncrByFloatProps0 & HIncrByFloatProps1;
  hkeys: HKeysProps0 & HKeysProps1 & HKeysProps2;
  hlen: HLenProps0 & HLenProps1 & HLenProps2;
  hmget: HmGetProps0 & HmGetProps1 & HmGetProps2;
  hmset: HmSetProps0 & HmSetProps1;
  hscan: HScanProps0 & HScanProps1;
  hset: HSetProps0 & HSetProps1;
  hsetnx: HSetNxProps0 & HSetNxProps1;
  hvals: HValsProps0 & HValsProps1 & HValsProps2;
  //
  del: DelProps0 & DelProps1;
  exists: ExistsProps0 & ExistsProps1 & ExistsProps2;
  expire: ExpireProps0 & ExpireProps1;
  expireat: ExpireAtProps0 & ExpireAtProps1;
  keys: KeysProps0 & KeysProps1 & KeysProps2;
  persist: PersistProps0 & PersistProps1;
  pexpire: PExpireProps0 & PExpireProps1;
  pexpireat: PExpireProps0 & PExpireProps1;
  pttl: PTTLProps0 & PTTLProps1 & PTTLProps2;
  randomkey: RandomKeyProps0 & RandomKeyProps1;
  rename: RenameProps0 & RenameProps1;
  renamenx: RenameNxProps0 & RenameNxProps1;
  scan: ScanProps0 & ScanProps1;
  touch: TouchProps0 & TouchProps1;
  ttl: TTLProps0 & TTLProps1 & TTLProps2;
  type: TypeProps0 & TypeProps1 & TypeProps2;
  unlink: UnlinkProps0 & UnlinkProps1;
  //
  lindex: LIndexProps0 & LIndexProps1 & LIndexProps2;
  linsert: LInsertProps0 & LInsertProps1;
  llen: LLenProps0 & LLenProps1 & LLenProps2;
  lpop: LPopProps0 & LPopProps1;
  lpush: LPushProps0 & LPushProps1;
  lpushx: LPushProps0 & LPushProps1;
  lrange: LRangeProps0 & LRangeProps1 & LRangeProps2;
  lrem: LRemProps0 & LRemProps1;
  lset: LSetProps0 & LSetProps1;
  ltrim: LTrimProps0 & LTrimProps1;
  rpop: RPopProps0 & RPopProps1;
  rpoplpush: RPopLPushProps0 & RPopLPushProps1;
  rpush: RPushProps0 & RPushProps1;
  rpushx: RPushProps0 & RPushProps1;
  //
  dbsize: DBSizeProps0 & DBSizeProps1 & DBSizeProps2;
  flushall: FlushAllProps0 & FlushAllProps1;
  flushdb: FlushAllProps0 & FlushAllProps1;
  info: InfoProps0 & InfoProps1 & InfoProps2;
  time: TimeProps0 & TimeProps1;
  //
  sadd: SAddProps0 & SAddProps1;
  scard: SCardProps0 & SCardProps1;
  sdiff: SDiffProps0 & SDiffProps1 & SDiffProps2;
  sdiffstore: SDiffStoreProps0 & SDiffStoreProps1;
  sinter: SInterProps0 & SInterProps1 & SInterProps2;
  sinterstore: SInterStoreProps0 & SInterStoreProps1;
  sismember: SIsMemberProps0 & SIsMemberProps1 & SIsMemberProps2;
  smembers: SMembersProps0 & SMembersProps1 & SMembersProps2;
  smove: SMoveProps0 & SMoveProps1;
  spop: SPopProps0 & SPopProps1;
  srandmember: SRandMemberProps0 & SRandMemberProps1 & SRandMemberProps2;
  srem: SRemProps0 & SRemProps1;
  sunion: SUnionProps0 & SUnionProps2 & SUnionProps1;
  sunionstore: SUnionStoreProps0 & SUnionStoreProps1;
  //
  zadd: ZAddProps0 & ZAddProps1;
  zcard: ZCardProps0 & ZCardProps1 & ZCardProps2;
  zcount: ZCountProps0 & ZCountProps1 & ZCountProps2;
  zincrby: ZIncrByProps0 & ZIncrByProps1;
  zinterstore: ZInterStoreProps0 & ZInterStoreProps1;
  zlexcount: ZLexCountProps0 & ZLexCountProps1 & ZLexCountProps2;
  zpopmax: ZPopMaxProps0 & ZPopMaxProps1;
  zpopmin: ZPopMaxProps0 & ZPopMaxProps1;
  zrange: ZRangeProps0 & ZRangeProps1 & ZRangeProps2;
  zrangebylex: ZRangeByLexProps0 & ZRangeByLexProps1 & ZRangeByLexProps2;
  zrangebyscore: ZRangeByScoreProps0 &
    ZRangeByScoreProps1 &
    ZRangeByScoreProps2;
  zrank: ZRankProps0 & ZRankProps1 & ZRankProps2;
  zrem: ZRemProps0 & ZRemProps1;
  zremrangebylex: ZRemRangeByLexProps0 & ZRemRangeByLexProps1;
  zremrangebyrank: ZRemRangeByRankProps0 & ZRemRangeByRankProps1;
  zremrangebyscore: ZRemRangeByScoreProps0 & ZRemRangeByScoreProps1;
  zrevrange: ZRevRangeProps0 & ZRevRangeProps1 & ZRevRangeProps2;
  zrevrangebylex: ZRevRangeByLexProps0 &
    ZRevRangeByLexProps1 &
    ZRevRangeByLexProps2;
  zrevrangebyscore: ZRevRangeByScoreProps0 &
    ZRevRangeByScoreProps1 &
    ZRevRangeByScoreProps2;
  zrevrank: ZRevRankProps0 & ZRevRankProps1 & ZRevRankProps2;
  zscore: ZScoreProps0 & ZScoreProps1 & ZScoreProps2;
  zunionstore: ZUnionStoreProps0 & ZUnionStoreProps1;
};
