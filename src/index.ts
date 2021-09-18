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
  mset,
  set,
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
  mset,
  set,
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
  ttl,
};
