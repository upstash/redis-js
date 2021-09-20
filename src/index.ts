import client from './client';

export default client;

const {
  auth,
  // STRING
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
  // BITMAPS
  bitcount,
  bitop,
  bitpos,
  getbit,
  setbit,
  // CONNECTION
  echo,
  ping,
  // SERVER
  info,
  time,
  //
  dbsize,
  del,
  exists,
  expire,
  flushall,
  flushdb,
  keys,
  pttl,
  ttl,
} = client();

export {
  auth,
  // STRING
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
  // BITMAPS
  bitcount,
  bitop,
  bitpos,
  getbit,
  setbit,
  // CONNECTION
  echo,
  ping,
  // SERVER
  info,
  time,
  //
  dbsize,
  del,
  exists,
  expire,
  flushall,
  flushdb,
  keys,
  pttl,
  ttl,
};
