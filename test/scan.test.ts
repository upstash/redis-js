import { flushdb, mget, mset, scan } from '../src';
import { nanoid } from 'nanoid';

describe('scan command', () => {
  it('basic', async () => {
    await flushdb();

    await mset(['field-1', '1', 'field-2', '2']);

    const { data: data } = await scan(0);
    expect(data[0]).toBe('0');
  });

  it('with match', async () => {
    await flushdb();

    await mset(['field-1', '1', 'field-2', '2']);

    const { data } = await scan(0, { match: '*-*' });
    expect(data[0]).toBe('0');
  });

  it('with count', async () => {
    await flushdb();

    await mset(['field-1', '1', 'field-2', '2']);

    const { data } = await scan(0, { count: 1 });
    expect(data[0]).toBe('1');
  });

  it('with match and count', async () => {
    await flushdb();

    await mset([
      'field-1',
      '1',
      'field-2',
      '2',
      'field_3',
      '3',
      'field_4',
      '4',
    ]);

    const { data } = await scan(0, { match: '*-*', count: 1 });
    expect(data[0]).toBe('1');
  });
});
