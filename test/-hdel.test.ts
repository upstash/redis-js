// import { set, hdel } from '../src';
//
// describe('del command', () => {
//   const key = 'mykey';
//   const key1 = 'del1';
//   const key2 = 'del2';
//   const key3 = 'del3';
//
//   it('basic', async () => {
//     await set(key1, 'Hello');
//     await set(key2, 'World');
//
//     const { data } = await hdel(key, [key1, key2, key3]);
//     expect(data).toBe(2);
//   });
// });
