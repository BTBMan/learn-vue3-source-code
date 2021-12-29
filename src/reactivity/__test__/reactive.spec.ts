import { reactive } from '../src/index';
import { readonly } from '../src/reactive';

describe('reactive', () => {
  test('Object', () => {
    const original = {
      a: 'a',
      b: {
        c: 'c',
      },
    };

    const observed = reactive(original);

    expect(observed.a).toBe('a');

    expect(observed.b).toStrictEqual({
      c: 'c',
    });
  });

  test('readonly', () => {
    const original: any = {
      a: 'a',
      b: {
        c: 'c',
      },
    };

    const observed = readonly(original);

    expect(observed.a).toBe('a');

    expect(observed.b).toStrictEqual({
      c: 'c',
    });

    observed.a = 'aa';
    observed.b = 'bb';
    observed.b = {};
  });
});
