import { get, set } from '../src';
import { nanoid } from 'nanoid';

describe('get command', () => {
  it('return null', async () => {
    const { data } = await get('key/null');
    expect(data).toBe(null);
  });

  it('return a value', async () => {
    const key = nanoid();
    const value = nanoid();

    await set(key, value);

    const { data } = await get(key);
    expect(data).toBe(value);
  });

  it('callback', (done) => {
    const key = nanoid();
    const value = nanoid();

    set(key, value)
      .then(({ data }) => {
        expect(data).toBe('OK');
      })
      .then(() => {
        get(key, ({ data: getData }) => {
          expect(getData).toBe(value);
          done();
        });
      });
  });
});
