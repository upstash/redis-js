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
  // CONNECTION
  echo,
  ping,
  // SERVER
  info,
  time,
  //
  bitcount,
  bitop,
  bitpos,
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
  // CONNECTION
  echo,
  ping,
  // SERVER
  info,
  time,
  //
  bitcount,
  bitop,
  bitpos,
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
