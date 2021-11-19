export type ClientObjectProps = {
  url?: undefined | string;
  token?: undefined | string;
  edgeUrl?: undefined | string;
  readFromEdge?: boolean;
  backend?: undefined | string;
};

export type EdgeCacheType = null | 'miss' | 'hit';

export type ReturnType = {
  data: string | number | [] | any;
  error: string | null;
  metadata?: { edge: boolean; cache: EdgeCacheType };
};

export type MethodReturn = Promise<ReturnType>;

export type RequestConfig =
  | undefined
  | {
      edge?: boolean;
    };

export type Part = string | boolean | number;

type Auth1 = (options?: ClientObjectProps) => void;
type Auth2 = (url?: string, token?: string) => void;
type Auth3 = (url?: string | ClientObjectProps, token?: string) => void;

export type Upstash = {
  auth: Auth1 & Auth2 & Auth3;
  //
  append: (...args: any) => MethodReturn;
  decr: (...args: any) => MethodReturn;
  decrby: (...args: any) => MethodReturn;
  get: (...args: any) => MethodReturn;
  getrange: (...args: any) => MethodReturn;
  getset: (...args: any) => MethodReturn;
  incr: (...args: any) => MethodReturn;
  incrby: (...args: any) => MethodReturn;
  incrbyfloat: (...args: any) => MethodReturn;
  mget: (...args: any) => MethodReturn;
  mset: (...args: any) => MethodReturn;
  msetnx: (...args: any) => MethodReturn;
  psetex: (...args: any) => MethodReturn;
  set: (...args: any) => MethodReturn;
  setex: (...args: any) => MethodReturn;
  setnx: (...args: any) => MethodReturn;
  setrange: (...args: any) => MethodReturn;
  strlen: (...args: any) => MethodReturn;
  //
  bitcount: (...args: any) => MethodReturn;
  bitop: (...args: any) => MethodReturn;
  bitpos: (...args: any) => MethodReturn;
  getbit: (...args: any) => MethodReturn;
  setbit: (...args: any) => MethodReturn;
  //
  echo: (...args: any) => MethodReturn;
  ping: (...args: any) => MethodReturn;
  //
  hdel: (...args: any) => MethodReturn;
  hexists: (...args: any) => MethodReturn;
  hget: (...args: any) => MethodReturn;
  hgetall: (...args: any) => MethodReturn;
  hincrby: (...args: any) => MethodReturn;
  hincrbyfloat: (...args: any) => MethodReturn;
  hkeys: (...args: any) => MethodReturn;
  hlen: (...args: any) => MethodReturn;
  hmget: (...args: any) => MethodReturn;
  hmset: (...args: any) => MethodReturn;
  hscan: (...args: any) => MethodReturn;
  hset: (...args: any) => MethodReturn;
  hsetnx: (...args: any) => MethodReturn;
  hvals: (...args: any) => MethodReturn;
  //
  del: (...args: any) => MethodReturn;
  exists: (...args: any) => MethodReturn;
  expire: (...args: any) => MethodReturn;
  expireat: (...args: any) => MethodReturn;
  keys: (...args: any) => MethodReturn;
  persist: (...args: any) => MethodReturn;
  pexpire: (...args: any) => MethodReturn;
  pexpireat: (...args: any) => MethodReturn;
  pttl: (...args: any) => MethodReturn;
  randomkey: (...args: any) => MethodReturn;
  rename: (...args: any) => MethodReturn;
  renamenx: (...args: any) => MethodReturn;
  scan: (...args: any) => MethodReturn;
  touch: (...args: any) => MethodReturn;
  ttl: (...args: any) => MethodReturn;
  type: (...args: any) => MethodReturn;
  unlink: (...args: any) => MethodReturn;
  //
  lindex: (...args: any) => MethodReturn;
  linsert: (...args: any) => MethodReturn;
  llen: (...args: any) => MethodReturn;
  lpop: (...args: any) => MethodReturn;
  lpush: (...args: any) => MethodReturn;
  lpushx: (...args: any) => MethodReturn;
  lrange: (...args: any) => MethodReturn;
  lrem: (...args: any) => MethodReturn;
  lset: (...args: any) => MethodReturn;
  ltrim: (...args: any) => MethodReturn;
  rpop: (...args: any) => MethodReturn;
  rpoplpush: (...args: any) => MethodReturn;
  rpush: (...args: any) => MethodReturn;
  rpushx: (...args: any) => MethodReturn;
  //
  dbsize: (...args: any) => MethodReturn;
  flushall: (...args: any) => MethodReturn;
  flushdb: (...args: any) => MethodReturn;
  info: (...args: any) => MethodReturn;
  time: (...args: any) => MethodReturn;
  //
  sadd: (...args: any) => MethodReturn;
  scard: (...args: any) => MethodReturn;
  sdiff: (...args: any) => MethodReturn;
  sdiffstore: (...args: any) => MethodReturn;
  sinter: (...args: any) => MethodReturn;
  sinterstore: (...args: any) => MethodReturn;
  sismember: (...args: any) => MethodReturn;
  smembers: (...args: any) => MethodReturn;
  smove: (...args: any) => MethodReturn;
  spop: (...args: any) => MethodReturn;
  srandmember: (...args: any) => MethodReturn;
  srem: (...args: any) => MethodReturn;
  sunion: (...args: any) => MethodReturn;
  sunionstore: (...args: any) => MethodReturn;
  //
  zadd: (...args: any) => MethodReturn;
  zcard: (...args: any) => MethodReturn;
  zcount: (...args: any) => MethodReturn;
  zincrby: (...args: any) => MethodReturn;
  zinterstore: (...args: any) => MethodReturn;
  zlexcount: (...args: any) => MethodReturn;
  zpopmax: (...args: any) => MethodReturn;
  zpopmin: (...args: any) => MethodReturn;
  zrange: (...args: any) => MethodReturn;
  zrangebylex: (...args: any) => MethodReturn;
  zrangebyscore: (...args: any) => MethodReturn;
  zrank: (...args: any) => MethodReturn;
  zrem: (...args: any) => MethodReturn;
  zremrangebylex: (...args: any) => MethodReturn;
  zremrangebyrank: (...args: any) => MethodReturn;
  zremrangebyscore: (...args: any) => MethodReturn;
  zrevrange: (...args: any) => MethodReturn;
  zrevrangebylex: (...args: any) => MethodReturn;
  zrevrangebyscore: (...args: any) => MethodReturn;
  zrevrank: (...args: any) => MethodReturn;
  zscore: (...args: any) => MethodReturn;
  zunionstore: (...args: any) => MethodReturn;
};
