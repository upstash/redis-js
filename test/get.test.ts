import { get, set } from '../src';
import { nanoid } from 'nanoid';

describe('redis get command', () => {
  const key = 'key';
  const value = nanoid();

  it('return null', async () => {
    const { data } = await get('key/null');
    expect(data).toEqual(null);
  });

  it('return a value', async () => {
    await set(key, value);

    const { data } = await get(key);
    expect(data).toEqual(value);
  });

  it('callback', (done) => {
    set(key, value)
      .then(({ data }) => {
        expect(data).toEqual('OK');
      })
      .then(() => {
        get(key, ({ data: getData }) => {
          expect(getData).toEqual(value);
          done();
        });
      });
  });
});
