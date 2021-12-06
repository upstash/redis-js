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

type SET1 = (key: string, value: string | number) => MethodReturn;
type SET2 = (
  key: string,
  value: string | number,
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

type SRANDMEMBER1 = (key: string) => MethodReturn;
type SRANDMEMBER2 = (key: string, count: number) => MethodReturn;

type ZPOPMAX1 = (key: string) => MethodReturn;
type ZPOPMAX2 = (key: string, count: number | string) => MethodReturn;

type ZRANGE1 = (key: string, min: ZSetNumber, max: ZSetNumber) => MethodReturn;
type ZRANGE2 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  withscores: 'WITHSCORES'
) => MethodReturn;

type ZRANGEBYLEX1 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber
) => MethodReturn;
type ZRANGEBYLEX2 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  limit: 'LIMIT',
  offset: number | string,
  count: number | string
) => MethodReturn;

type ZRANGEBYSCORE1 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber
) => MethodReturn;
type ZRANGEBYSCORE2 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  withScores: 'WITHSCORES'
) => MethodReturn;
type ZRANGEBYSCORE3 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  limit: 'LIMIT',
  offset: number | string,
  count: number | string
) => MethodReturn;
type ZRANGEBYSCORE4 = (
  key: string,
  min: ZSetNumber,
  max: ZSetNumber,
  withScores: 'WITHSCORES',
  limit: 'LIMIT',
  offset: number | string,
  count: number | string
) => MethodReturn;

type ZREVRANGEBYLEX1 = (
  key: string,
  max: ZSetNumber,
  min: ZSetNumber
) => MethodReturn;
type ZREVRANGEBYLEX2 = (
  key: string,
  max: ZSetNumber,
  min: ZSetNumber,
  limit: 'LIMIT',
  offset: number | string,
  count: number | string
) => MethodReturn;

type ZREVRANGEBYSCORE1 = (
  key: string,
  max: ZSetNumber,
  min: ZSetNumber
) => MethodReturn;
type ZREVRANGEBYSCORE2 = (
  key: string,
  max: ZSetNumber,
  min: ZSetNumber,
  withScores: 'WITHSCORES'
) => MethodReturn;
type ZREVRANGEBYSCORE3 = (
  key: string,
  max: ZSetNumber,
  min: ZSetNumber,
  limit: 'LIMIT',
  offset: number | string,
  count: number | string
) => MethodReturn;
type ZREVRANGEBYSCORE4 = (
  key: string,
  max: ZSetNumber,
  min: ZSetNumber,
  withScores: 'WITHSCORES',
  limit: 'LIMIT',
  offset: number | string,
  count: number | string
) => MethodReturn;

type ZREVRANGE1 = (
  key: string,
  start: number | string,
  stop: number | string
) => MethodReturn;
type ZREVRANGE2 = (
  key: string,
  start: number | string,
  stop: number | string,
  withscores: 'WITHSCORES'
) => MethodReturn;

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
  lpush: (key: string, ...element: any) => MethodReturn;
  lpushx: (key: string, ...element: any) => MethodReturn;
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
  srandmember: SRANDMEMBER1 & SRANDMEMBER2;
  srem: (key: string, ...member: any) => MethodReturn;
  sunion: (...key: any) => MethodReturn;
  sunionstore: (destination: string, ...key: any) => MethodReturn;
  //
  zadd: (key: string, ...scoreMember: any) => MethodReturn;
  zcard: (key: string) => MethodReturn;
  zcount: (key: string, min: ZSetNumber, max: ZSetNumber) => MethodReturn;
  zincrby: (
    key: string,
    increment: number | string,
    member: string
  ) => MethodReturn;
  // TODO: fix args
  zinterstore: (
    destination: string,
    numkeys: number | string,
    ...key: any
  ) => MethodReturn;
  zlexcount: (key: string, min: ZSetNumber, max: ZSetNumber) => MethodReturn;
  zpopmax: ZPOPMAX1 & ZPOPMAX2;
  zpopmin: ZPOPMAX1 & ZPOPMAX2;
  zrange: ZRANGE1 & ZRANGE2;
  zrangebylex: ZRANGEBYLEX1 & ZRANGEBYLEX2;
  zrangebyscore: ZRANGEBYSCORE1 &
    ZRANGEBYSCORE2 &
    ZRANGEBYSCORE3 &
    ZRANGEBYSCORE4;
  zrank: (key: string, member: string) => MethodReturn;
  zrem: (key: string, ...member: any) => MethodReturn;
  zremrangebylex: (
    key: string,
    min: ZSetNumber,
    max: ZSetNumber
  ) => MethodReturn;
  zremrangebyrank: (
    key: string,
    start: number | string,
    stop: number | string
  ) => MethodReturn;
  zremrangebyscore: (
    key: string,
    min: ZSetNumber,
    max: ZSetNumber
  ) => MethodReturn;
  zrevrange: ZREVRANGE1 & ZREVRANGE2;
  zrevrangebylex: ZREVRANGEBYLEX1 & ZREVRANGEBYLEX2;
  zrevrangebyscore: ZREVRANGEBYSCORE1 &
    ZREVRANGEBYSCORE2 &
    ZREVRANGEBYSCORE3 &
    ZREVRANGEBYSCORE4;
  zrevrank: (key: string, member: string) => MethodReturn;
  zscore: (key: string, member: string) => MethodReturn;
  // TODO: fix args
  zunionstore: (destination: string, ...numkeys: any) => MethodReturn;
};
