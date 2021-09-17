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
  flushdb,
  get,
  set,
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
  flushdb,
  get,
  set,
};
