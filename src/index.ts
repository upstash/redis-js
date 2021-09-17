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
  flushdb,
  get,
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
  flushdb,
  get,
  set,
  ttl,
};
