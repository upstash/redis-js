import upstash from './client';

export const {
  auth,
  append,
  decr,
  decrby,
  get,
  getrange,
  getset,
  incr,
  incrby,
  incrbyfloat,
  mget,
  mset,
  msetnx,
  psetex,
  set,
  setex,
  setnx,
  setrange,
  strlen,
  bitcount,
  bitop,
  bitpos,
  getbit,
  setbit,
  echo,
  ping,
  hdel,
  hexists,
  hget,
  hgetall,
  hincrby,
  hincrbyfloat,
  hkeys,
  hlen,
  hmget,
  hmset,
  hscan,
  hset,
  hsetnx,
  hvals,
  del,
  exists,
  expire,
  expireat,
  keys,
  persist,
  pexpire,
  pexpireat,
  pttl,
  randomkey,
  rename,
  renamenx,
  scan,
  touch,
  ttl,
  type,
  unlink,
  lindex,
  linsert,
  llen,
  lpop,
  lpush,
  lpushx,
  lrange,
  lrem,
  lset,
  ltrim,
  rpop,
  rpoplpush,
  rpush,
  rpushx,
  dbsize,
  flushall,
  flushdb,
  info,
  time,
  sadd,
  scard,
  sdiff,
  sdiffstore,
  sinter,
  sinterstore,
  sismember,
  smembers,
  smove,
  spop,
  srandmember,
  srem,
  sunion,
  sunionstore,
  zadd,
  zcard,
  zcount,
  zincrby,
  zinterstore,
  zlexcount,
  zpopmax,
  zpopmin,
  zrange,
  zrangebylex,
  zrangebyscore,
  zrank,
  zrem,
  zremrangebylex,
  zremrangebyrank,
  zremrangebyscore,
  zrevrange,
  zrevrangebylex,
  zrevrangebyscore,
  zrevrank,
  zscore,
  zunionstore,
} = upstash();

export default upstash;

module.exports = upstash;
module.exports.auth = auth;
module.exports.append = append;
module.exports.decr = decr;
module.exports.decrby = decrby;
module.exports.get = get;
module.exports.getrange = getrange;
module.exports.getset = getset;
module.exports.incr = incr;
module.exports.incrby = incrby;
module.exports.incrbyfloat = incrbyfloat;
module.exports.mget = mget;
module.exports.mset = mset;
module.exports.msetnx = msetnx;
module.exports.psetex = psetex;
module.exports.set = set;
module.exports.setex = setex;
module.exports.setnx = setnx;
module.exports.setrange = setrange;
module.exports.strlen = strlen;
module.exports.bitcount = bitcount;
module.exports.bitop = bitop;
module.exports.bitpos = bitpos;
module.exports.getbit = getbit;
module.exports.setbit = setbit;
module.exports.echo = echo;
module.exports.ping = ping;
module.exports.hdel = hdel;
module.exports.hexists = hexists;
module.exports.hget = hget;
module.exports.hgetall = hgetall;
module.exports.hincrby = hincrby;
module.exports.hincrbyfloat = hincrbyfloat;
module.exports.hkeys = hkeys;
module.exports.hlen = hlen;
module.exports.hmget = hmget;
module.exports.hmset = hmset;
module.exports.hscan = hscan;
module.exports.hset = hset;
module.exports.hsetnx = hsetnx;
module.exports.hvals = hvals;
module.exports.del = del;
module.exports.exists = exists;
module.exports.expire = expire;
module.exports.expireat = expireat;
module.exports.keys = keys;
module.exports.persist = persist;
module.exports.pexpire = pexpire;
module.exports.pexpireat = pexpireat;
module.exports.pttl = pttl;
module.exports.randomkey = randomkey;
module.exports.rename = rename;
module.exports.renamenx = renamenx;
module.exports.scan = scan;
module.exports.touch = touch;
module.exports.ttl = ttl;
module.exports.type = type;
module.exports.unlink = unlink;
module.exports.lindex = lindex;
module.exports.linsert = linsert;
module.exports.llen = llen;
module.exports.lpop = lpop;
module.exports.lpush = lpush;
module.exports.lpushx = lpushx;
module.exports.lrange = lrange;
module.exports.lrem = lrem;
module.exports.lset = lset;
module.exports.ltrim = ltrim;
module.exports.rpop = rpop;
module.exports.rpoplpush = rpoplpush;
module.exports.rpush = rpush;
module.exports.rpushx = rpushx;
module.exports.dbsize = dbsize;
module.exports.flushall = flushall;
module.exports.flushdb = flushdb;
module.exports.info = info;
module.exports.time = time;
module.exports.sadd = sadd;
module.exports.scard = scard;
module.exports.sdiff = sdiff;
module.exports.sdiffstore = sdiffstore;
module.exports.sinter = sinter;
module.exports.sinterstore = sinterstore;
module.exports.sismember = sismember;
module.exports.smembers = smembers;
module.exports.smove = smove;
module.exports.spop = spop;
module.exports.srandmember = srandmember;
module.exports.srem = srem;
module.exports.sunion = sunion;
module.exports.sunionstore = sunionstore;
module.exports.zadd = zadd;
module.exports.zcard = zcard;
module.exports.zcount = zcount;
module.exports.zincrby = zincrby;
module.exports.zinterstore = zinterstore;
module.exports.zlexcount = zlexcount;
module.exports.zpopmax = zpopmax;
module.exports.zpopmin = zpopmin;
module.exports.zrange = zrange;
module.exports.zrangebylex = zrangebylex;
module.exports.zrangebyscore = zrangebyscore;
module.exports.zrank = zrank;
module.exports.zrem = zrem;
module.exports.zremrangebylex = zremrangebylex;
module.exports.zremrangebyrank = zremrangebyrank;
module.exports.zremrangebyscore = zremrangebyscore;
module.exports.zrevrange = zrevrange;
module.exports.zrevrangebylex = zrevrangebylex;
module.exports.zrevrangebyscore = zrevrangebyscore;
module.exports.zrevrank = zrevrank;
module.exports.zscore = zscore;
module.exports.zunionstore = zunionstore;
