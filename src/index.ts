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
  flushdb,
  get,
  set,
};
