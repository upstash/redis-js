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

export type Upstash = {
  auth: Auth1 & Auth2 & Auth3;
  //
  append: (key: string, value: string) => MethodReturn;
  decr: (key: string) => MethodReturn;
  decrby: (key: string, decrement: number) => MethodReturn;
  get: (key: string) => MethodReturn;
  getrange: (key: string, start: number, end: number) => MethodReturn;
  getset: (key: string, value: string) => MethodReturn;
  incr: (key: string) => MethodReturn;
  incrby: (key: string, value: number | string) => MethodReturn;
  incrbyfloat: (key: string, value: number | string) => MethodReturn;
  mget: (values: string[]) => MethodReturn;
  mset: (values: string[]) => MethodReturn;
  msetnx: (values: string[]) => MethodReturn;
  psetex: (
    key: string,
    miliseconds: number,
    value: string | number
  ) => MethodReturn;
  set: (key: string, value: number | string) => MethodReturn;
  setex: (key: string, seconds: number, value: string | number) => MethodReturn;
  setnx: (key: string, value: string) => MethodReturn;
  setrange: (
    key: string,
    offset: number | string,
    value: string
  ) => MethodReturn;
  strlen: (key: string) => MethodReturn;
  //
  bitcount: (key: string, start?: number, end?: number) => MethodReturn;
  bitop: (
    operation: 'AND' | 'OR' | 'XOR' | 'NOT',
    destinationKey: string,
    sourceKeys: string[]
  ) => MethodReturn;
  bitpos: (key: string, bit: Bit, start?: number, end?: number) => MethodReturn;
  getbit: (key: string, offset: number) => MethodReturn;
  setbit: (key: string, offset: number, value: Bit) => MethodReturn;
  //
  echo: (value: string) => MethodReturn;
  ping: (value?: string) => MethodReturn;
  //
  hdel: (key: string, fields: string[]) => MethodReturn;
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
  hmget: (key: string, fields: string[]) => MethodReturn;
  hmset: (key: string, values: string[]) => MethodReturn;
  hscan: (
    key: string,
    cursor: number,
    options?: { match?: number | string; count?: number | string }
  ) => MethodReturn;
  hset: (key: string, values: string[]) => MethodReturn;
  hsetnx: (key: string, field: string, value: string) => MethodReturn;
  hvals: (key: string) => MethodReturn;
  //
  del: (keys: string[]) => MethodReturn;
  exists: (keys: string[]) => MethodReturn;
  expire: (key: string, seconds: number) => MethodReturn;
  expireat: (key: string, timestamp: number | string) => MethodReturn;
  keys: (pattern: string) => MethodReturn;
  persist: (key: string) => MethodReturn;
  pexpire: (key: string, miliseconds: number) => MethodReturn;
  pexpireat: (key: string, miliseconds: number) => MethodReturn;
  pttl: (key: string) => MethodReturn;
  randomkey: () => MethodReturn;
  rename: (key: string, newKey: string) => MethodReturn;
  renamenx: (key: string, newKey: string) => MethodReturn;
  scan: (
    cursor: number,
    opitons?: { match?: number | string; count?: number | string }
  ) => MethodReturn;
  touch: (keys: string[]) => MethodReturn;
  ttl: (key: string) => MethodReturn;
  type: (key: string) => MethodReturn;
  unlink: (keys: string[]) => MethodReturn;
  //
  lindex: (key: string, index: number) => MethodReturn;
  linsert: (
    key: string,
    option: 'BEFORE' | 'AFTER',
    pivot: string,
    element: string
  ) => MethodReturn;
  llen: (key: string) => MethodReturn;
  lpop: (key: string) => MethodReturn;
  lpush: (key: string, elements: string[]) => MethodReturn;
  lpushx: (key: string, elements: string[]) => MethodReturn;
  lrange: (key: string, start: number, stop: number) => MethodReturn;
  lrem: (key: string, count: number, element: string) => MethodReturn;
  lset: (key: string, index: number, element: string) => MethodReturn;
  ltrim: (key: string, start: number, stop: number) => MethodReturn;
  rpop: (key: string) => MethodReturn;
  rpoplpush: (source: string, destination: string) => MethodReturn;
  rpush: (key: string, elements: string[]) => MethodReturn;
  rpushx: (key: string, elements: string[]) => MethodReturn;
  //
  dbsize: () => MethodReturn;
  flushall: (mode?: 'ASYNC') => MethodReturn;
  flushdb: (mode?: 'ASYNC') => MethodReturn;
  info: () => MethodReturn;
  time: () => MethodReturn;
  //
  sadd: (key: string, members: string[]) => MethodReturn;
  scard: (key: string) => MethodReturn;
  sdiff: (keys: string[]) => MethodReturn;
  sdiffstore: (destination: string, keys: string[]) => MethodReturn;
  sinter: (keys: string[]) => MethodReturn;
  sinterstore: (destination: string, keys: string[]) => MethodReturn;
  sismember: (key: string, member: string) => MethodReturn;
  smembers: (key: string) => MethodReturn;
  smove: (source: string, destination: string, member: string) => MethodReturn;
  spop: (key: string, count?: number) => MethodReturn;
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
