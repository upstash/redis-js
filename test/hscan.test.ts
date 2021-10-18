import { mset, flushdb, scan, hscan, hset } from '../src';
import { nanoid } from 'nanoid';

describe('hscan command', () => {
  it('basic', async () => {
    const myHash = nanoid();

    const { data: setData } = await hset(myHash, ['key1', '1', 'key2', '2']);
    expect(setData).toBe(2);

    const { data } = await hscan(myHash, 0);
    expect(data[0]).toBe('0');
    expect(data[1].length).toBeGreaterThanOrEqual(4);
  });

  it('with match', async () => {
    await flushdb();

    const myHash = nanoid();

    const { data: setData } = await hset(myHash, [
      'field-1',
      '1',
      'field-2',
      '2',
      'field_3',
      '3',
      'field_4',
      '4',
    ]);
    expect(setData).toBe(4);

    const { data } = await hscan(myHash, 0, { match: '*_*' });
    expect(data[0]).toBe('0');
    expect(data[1].length).toBeGreaterThanOrEqual(4);
  });

  it('with count', async () => {
    await flushdb();

    const myHash = nanoid();

    const { data: setData } = await hset(myHash, [
      'field-1',
      '1',
      'field-2',
      '2',
      'field_3',
      '3',
      'field_4',
      '4',
    ]);
    expect(setData).toBe(4);

    const { data: data } = await hscan(myHash, 0, { count: 10 });
    expect(data[0]).toBe('0');
    expect(data[1].length).toBeGreaterThanOrEqual(8);
  });

  it('with match and count', async () => {
    await flushdb();

    const fields = [
      'field-1',
      '1',
      'field-2',
      '2',
      'field_3',
      '3',
      'field_4',
      '4',
    ];
    await mset(fields);

    // TODO: [key, value, ...] ?
    const { data } = await scan(0, { match: '*_*', count: 10 });
    console.log(data);
    // expect(data[1].length).toBeGreaterThanOrEqual(4);
  });
});
