// import { nanoid } from 'nanoid';
import { get } from '../src';

describe('redis get command', () => {
  it('should return null', async () => {
    const { data, error } = await get('key1');
    console.log(data, error);
    // expect(data).toEqual('kyBoCJCXNquQCxjs0VMD4_yaLJ38msLFNFPb-EH1wh');
    // expect(error).toBeUndefined();
  });

  it('should run callback', (done) => {
    get('key1', ({ data, error }) => {
      console.log(data, error);
      // expect(data).toEqual('kyBoCJCXNquQCxjs0VMD4_yaLJ38msLFNFPb-EH1wh');
      // expect(error).toBeUndefined();
      done();
    });
  });

  // it('should return a value', async () => {
  //   const key = 'key1';
  //   const value = nanoid();
  //
  //   const { error: setError } = await set(key, value);
  //   expect(setError).toBeUndefined();
  //
  //   const { data, error } = await get(key);
  //   expect(error).toBeUndefined();
  //   expect(data).toBe(value);
  // });
});
