import client from './client';

export default client;

const {
  auth,
  append,
  bitcount,
  bitop,
  bitpos,
  dbsize,
  decr,
  decrby,
  del,
  exists,
  expire,
  flushall,
  flushdb,
  get,
  keys,
  mset,
  set,
  ttl,
} = client();

export {
  auth,
  append,
  bitcount,
  bitop,
  bitpos,
  dbsize,
  decr,
  decrby,
  del,
  exists,
  expire,
  flushall,
  flushdb,
  get,
  keys,
  mset,
  set,
  ttl,
};
