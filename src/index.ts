import client from './client';

export default client;

const {
  auth,
  // String
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
  setex,
  set,
  psetex,
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
  // String
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
  setex,
  set,
  psetex,
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
