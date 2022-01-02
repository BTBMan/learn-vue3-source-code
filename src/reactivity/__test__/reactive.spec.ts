import { reactive, readonly, shallowReadonly } from '../src/index';
import { shallowReadonly as sro } from '@vue/reactivity';

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
    // observed.a = 'aa';
    // observed.b = 'bb';
    // observed.b = {};
  });

  test('shallow readonly', () => {
    const original: any = {
      a: 'a',
      b: {
        c: 'c',
      },
    };

    const observed = shallowReadonly(original);
    expect(observed.a).toBe('a');
    expect(observed.b).toStrictEqual({
      c: 'c',
    });
    // observed.a = 'aa';
    // observed.b = 'bb';
    // observed.b = {};
    observed.b.c = 'cc';
    expect(observed.b.c).toBe('cc');

    const ob = sro(original);

    console.log('vue sro========>', ob);
    ob.b.c = 'ccc';
  });

  test('proxy test', () => {
    const obj = {
      a: 'a',
      b: {
        c: 'c',
        d: {
          e: 'e',
        },
      },
    };

    const proxyObj = new Proxy(obj, {
      get(target, key, receiver) {
        console.log('get key', key);

        return Reflect.get(target, key, receiver);
      },
      set(target, key, value, receiver) {
        console.log('set key', key);

        return Reflect.set(target, key, value, receiver);
      },
    });

    proxyObj.b.c = 'cc';
    console.log(proxyObj.b.c);
    console.log(obj);
  });
});
