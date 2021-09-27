import { mset, flushdb, scan, hscan, hset } from '../src';
import { nanoid } from 'nanoid';

describe('hvals command', () => {
  it('basic', async () => {
    await flushdb();

    const myHash = nanoid();

    const { data: setData } = await hset(myHash, [
      'field-1',
      '1',
      'field-2',
      '2',
    ]);
    expect(setData).toBe(2);

    const { data: scanData } = await hscan(myHash, '0');
    expect(scanData).toBeInstanceOf(Array);
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

    const { data: scanData } = await hscan(myHash, '0', { match: '*_*' });
    expect(scanData[1]).toMatchObject(['field_3', '3', 'field_4', '4']);
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

    // TODO: mehmet'e sor?
    const { data: scanData } = await hscan(myHash, '0', { count: 2 });
    expect(scanData[0]).toBe('2');
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

    const { data } = await scan(0, { match: '*_*', count: 1 });
    expect(data[0]).toBe('1');
  });
});
