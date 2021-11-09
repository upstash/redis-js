import { flushdb, scan, hscan, hset } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('hscan command', () => {
  it('basic', async () => {
    const myHash = nanoid();

    const { data: setData } = await hset(myHash, 'f1', 'v1', 'f2', 'v2');
    expect(setData).toBe(2);

    const { data } = await hscan(myHash, 0);
    expect(data[0]).toBe('0');
    expect(data[1].length).toBeGreaterThanOrEqual(4);
  });

  it('with match', async () => {
    await flushdb();

    const myHash = nanoid();

    const { data: setData } = await hset(
      myHash,
      'f1',
      'v1',
      'f2',
      'v2',
      'f-3',
      'v3',
      'f-4',
      'v4'
    );
    expect(setData).toBe(4);

    const { data } = await hscan(myHash, 0, 'MATCH', '*-*');
    expect(data[0]).toBe('0');
    expect(data[1].length).toBeGreaterThanOrEqual(4);
  });

  it('with count', async () => {
    await flushdb();

    const myHash = nanoid();

    const { data: setData } = await hset(
      myHash,
      'f1',
      'v1',
      'f2',
      'v2',
      'f-3',
      'v3',
      'f-4',
      'v4'
    );
    expect(setData).toBe(4);

    const { data: data } = await hscan(myHash, 0, 'COUNT', 10);
    expect(data[0]).toBe('0');
    expect(data[1].length).toBeGreaterThanOrEqual(8);
  });

  it('with match and count', async () => {
    await flushdb();

    const myHash = nanoid();

    const { data: setData } = await hset(
      myHash,
      'f1',
      'v1',
      'f2',
      'v2',
      'f-3',
      'v3',
      'f-4',
      'v4'
    );
    expect(setData).toBe(4);

    const { data } = await hscan(myHash, 0, 'MATCH', '*-*', 'COUNT', 10);
    expect(data[0]).toBe('0');
    expect(data[1].length).toBeGreaterThanOrEqual(4);
  });
});
