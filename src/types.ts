export type ClientObjectProps = {
  url?: undefined | string;
  token?: undefined | string;
  requestOptions?: undefined | RequestInit;
};

export type ReturnType = {
  data: string | number | [] | any;
  error: string | null;
};

export type MethodReturn = Promise<ReturnType>;

export type Part = string | boolean | number;

export type Bit = 0 | 1;

export type Infinities = '+inf' | '-inf';

export type ZSetNumber = Infinities | number | string;

type Auth1 = (options?: ClientObjectProps) => void;
type Auth2 = (url?: string, token?: string) => void;
type Auth3 = (url?: string | ClientObjectProps, token?: string) => void;

type SET1 = (key: string, value: string) => MethodReturn;
type SET2 = (
  key: string,
  value: string,
  timeType: 'EX' | 'PX',
  time: number | string
) => MethodReturn;

type BITCOUNT1 = (key: string) => MethodReturn;
type BITCOUNT2 = (
  key: string,
  start: number | string,
  end: number | string
) => MethodReturn;

type BITPOS1 = (key: string, bit: Bit) => MethodReturn;
type BITPOS2 = (key: string, bit: Bit, start: number) => MethodReturn;
type BITPOS3 = (
  key: string,
  bit: Bit,
  start: number,
  end: number
) => MethodReturn;

type PING1 = () => MethodReturn;
type PING2 = (message: string) => MethodReturn;

type HSCAN1 = (key: string, cursor: number | string) => MethodReturn;
type HSCAN2 = (
  key: string,
  cursor: number | string,
  match: 'MATCH',
  pattern: string
) => MethodReturn;
type HSCAN3 = (
  key: string,
  cursor: number | string,
  count: 'COUNT',
  value: number | string
) => MethodReturn;
type HSCAN4 = (
  key: string,
  cursor: number | string,
  match: 'MATCH',
  pattern: string,
  count: 'COUNT',
  value: number | string
) => MethodReturn;

type SCAN1 = (cursor: number | string) => MethodReturn;
type SCAN2 = (
  cursor: number | string,
  match: 'MATCH',
  pattern: string
) => MethodReturn;
type SCAN3 = (
  cursor: number | string,
  count: 'COUNT',
  value: number | string
) => MethodReturn;
type SCAN4 = (
  cursor: number | string,
  match: 'MATCH',
  pattern: string,
  count: 'COUNT',
  value: number | string
) => MethodReturn;

type FLUSHALL1 = () => MethodReturn;
type FLUSHALL2 = (mode: 'ASYNC') => MethodReturn;

type FLUSHDB1 = () => MethodReturn;
type FLUSHDB2 = (mode: 'ASYNC' | 'SYNC') => MethodReturn;

type INFO1 = () => MethodReturn;
type INFO2 = (section: string) => MethodReturn;

type SPOP1 = (key: string) => MethodReturn;
type SPOP2 = (key: string, count: number) => MethodReturn;

export type Upstash = {
  auth: Auth1 & Auth2 & Auth3;
  //
  append: (key: string, value: string) => MethodReturn;
  decr: (key: string) => MethodReturn;
  decrby: (key: string, decrement: number | string) => MethodReturn;
  get: (key: string) => MethodReturn;
  getrange: (
    key: string,
    start: number | string,
    end: number | string
  ) => MethodReturn;
  getset: (key: string, value: string) => MethodReturn;
  incr: (key: string) => MethodReturn;
  incrby: (key: string, increment: number | string) => MethodReturn;
  incrbyfloat: (key: string, increment: number | string) => MethodReturn;
  mget: (...key: any) => MethodReturn;
  mset: (...keyValue: any) => MethodReturn;
  msetnx: (...keyValue: any) => MethodReturn;
  psetex: (
    key: string,
    miliseconds: number | string,
    value: string
  ) => MethodReturn;
  set: SET1 & SET2;
  setex: (key: string, seconds: number | string, value: string) => MethodReturn;
  setnx: (key: string, value: string) => MethodReturn;
  setrange: (
    key: string,
    offset: number | string,
    value: string
  ) => MethodReturn;
  strlen: (key: string) => MethodReturn;
  //
  bitcount: BITCOUNT1 & BITCOUNT2;
  bitop: (
    operation: 'AND' | 'OR' | 'XOR' | 'NOT',
    destKey: string,
    ...key: any
  ) => MethodReturn;
  bitpos: BITPOS1 & BITPOS2 & BITPOS3;
  getbit: (key: string, offset: number | string) => MethodReturn;
  setbit: (key: string, offset: number | string, value: Bit) => MethodReturn;
  //
  echo: (message: string) => MethodReturn;
  ping: PING1 & PING2;
  //
  hdel: (key: string, ...field: any) => MethodReturn;
  hexists: (key: string, field: string) => MethodReturn;
  hget: (key: string, field: string) => MethodReturn;
  hgetall: (key: string) => MethodReturn;
  hincrby: (
    key: string,
    field: string,
    increment: number | string
  ) => MethodReturn;
  hincrbyfloat: (
    key: string,
    field: string,
    increment: number | string
  ) => MethodReturn;
  hkeys: (key: string) => MethodReturn;
  hlen: (key: string) => MethodReturn;
  hmget: (key: string, ...field: any) => MethodReturn;
  hmset: (key: string, ...fieldValue: any) => MethodReturn;
  hscan: HSCAN1 & HSCAN2 & HSCAN3 & HSCAN4;
  hset: (key: string, ...fieldValue: any) => MethodReturn;
  hsetnx: (key: string, field: string, value: string) => MethodReturn;
  hvals: (key: string) => MethodReturn;
  //
  del: (...key: any) => MethodReturn;
  exists: (...key: any) => MethodReturn;
  expire: (key: string, seconds: number | string) => MethodReturn;
  expireat: (key: string, timestamp: number | string) => MethodReturn;
  keys: (pattern: string) => MethodReturn;
  persist: (key: string) => MethodReturn;
  pexpire: (key: string, miliseconds: number | string) => MethodReturn;
  pexpireat: (
    key: string,
    milisecondsTimestamp: number | string
  ) => MethodReturn;
  pttl: (key: string) => MethodReturn;
  randomkey: () => MethodReturn;
  rename: (key: string, newKey: string) => MethodReturn;
  renamenx: (key: string, newKey: string) => MethodReturn;
  scan: SCAN1 & SCAN2 & SCAN3 & SCAN4;
  touch: (...key: any) => MethodReturn;
  ttl: (key: string) => MethodReturn;
  type: (key: string) => MethodReturn;
  unlink: (...key: any) => MethodReturn;
  //
  lindex: (key: string, index: number | string) => MethodReturn;
  linsert: (
    key: string,
    option: 'BEFORE' | 'AFTER',
    pivot: string,
    element: string
  ) => MethodReturn;
  llen: (key: string) => MethodReturn;
  lpop: (key: string) => MethodReturn;
  lpush: (key: string, element: any) => MethodReturn;
  lpushx: (key: string, element: any) => MethodReturn;
  lrange: (
    key: string,
    start: number | string,
    stop: number | string
  ) => MethodReturn;
  lrem: (key: string, count: number | string, element: string) => MethodReturn;
  lset: (key: string, index: number | string, element: string) => MethodReturn;
  ltrim: (
    key: string,
    start: number | string,
    stop: number | string
  ) => MethodReturn;
  rpop: (key: string) => MethodReturn;
  rpoplpush: (source: string, destination: string) => MethodReturn;
  rpush: (key: string, ...element: any) => MethodReturn;
  rpushx: (key: string, ...element: any) => MethodReturn;
  //
  dbsize: () => MethodReturn;
  flushall: FLUSHALL1 & FLUSHALL2;
  flushdb: FLUSHDB1 & FLUSHDB2;
  info: INFO1 & INFO2;
  time: () => MethodReturn;
  //
  sadd: (key: string, ...member: any) => MethodReturn;
  scard: (key: string) => MethodReturn;
  sdiff: (...key: any) => MethodReturn;
  sdiffstore: (destination: string, ...key: any) => MethodReturn;
  sinter: (...key: any) => MethodReturn;
  sinterstore: (destination: string, ...key: any) => MethodReturn;
  sismember: (key: string, member: string) => MethodReturn;
  smembers: (key: string) => MethodReturn;
  smove: (source: string, destination: string, member: string) => MethodReturn;
  spop: SPOP1 & SPOP2;
  srandmember: (key: string, count?: number) => MethodReturn;
  srem: (key: string, members: string[]) => MethodReturn;
  sunion: (keys: string[]) => MethodReturn;
  sunionstore: (destination: string, keys: string[]) => MethodReturn;
  //
  zadd: (
    key: string,
    values: ZSetNumber[],
    options?: ({ xx?: boolean } | { nx?: boolean }) & {
      ch?: boolean;
      incr: boolean;
    }
  ) => MethodReturn;
  zcard: (key: string) => MethodReturn;
  zcount: (key: string, min: ZSetNumber, max: ZSetNumber) => MethodReturn;
  zincrby: (
    key: string,
    increment: number | string,
    member: string
  ) => MethodReturn;
  zinterstore: (
    destination: string,
    keys: string[],
    options?: { weights?: number[]; aggregate?: 'MIN' | 'MAX' | 'SUM' }
  ) => MethodReturn;
  zlexcount: (key: string, min: ZSetNumber, max: ZSetNumber) => MethodReturn;
  zpopmax: (key: string, count?: number) => MethodReturn;
  zpopmin: (key: string, count?: number) => MethodReturn;
  zrange: (
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    options?: { withScores: boolean }
  ) => MethodReturn;
  zrangebylex: (
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    offset?: number,
    count?: number
  ) => MethodReturn;
  zrangebyscore: (
    key: string,
    min: ZSetNumber,
    max: ZSetNumber,
    options?: {
      withScores?: boolean;
      limit?: { offset: number; count: number };
    }
  ) => MethodReturn;
  zrank: (key: string, member: string) => MethodReturn;
  zrem: (key: string, members: string[]) => MethodReturn;
  zremrangebylex: (
    key: string,
    min: ZSetNumber,
    max: ZSetNumber
  ) => MethodReturn;
  zremrangebyrank: (key: string, start: number, stop: number) => MethodReturn;
  zremrangebyscore: (
    key: string,
    min: ZSetNumber,
    max: ZSetNumber
  ) => MethodReturn;
  zrevrange: (
    key: string,
    start: number,
    stop: number,
    options?: { withScores: boolean }
  ) => MethodReturn;
  zrevrangebylex: (
    key: string,
    max: ZSetNumber,
    min: ZSetNumber,
    offset?: number,
    count?: number
  ) => MethodReturn;
  zrevrangebyscore: (
    key: string,
    min: ZSetNumber,
    max: ZSetNumber
  ) => MethodReturn;
  zrevrank: (key: string, member: string) => MethodReturn;
  zscore: (key: string, member: string) => MethodReturn;
  zunionstore: (
    destination: string,
    keys: string[],
    options?: { weights?: number[]; aggregate?: 'MIN' | 'MAX' | 'SUM' }
  ) => MethodReturn;
};
