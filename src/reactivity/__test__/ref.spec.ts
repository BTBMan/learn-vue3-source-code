import { isReactive, isRef, ref, unRef, proxyRefs } from '../src';

describe('ref', () => {
  test('ref object is a reactive object', () => {
    const numRef = ref(1);
    const objRef = ref({
      a: 'a',
    });

    expect(numRef.value).toBe(1);
    expect(objRef.value).toEqual({ a: 'a' });
    expect(isReactive(objRef.value)).toBe(true);
  });
  test('isRef', () => {
    const numRef = ref(1);
    const objRef = ref({
      a: 'a',
    });

    expect(isRef(numRef)).toBe(true);
    expect(isRef(objRef)).toBe(true);
  });
  test('unref', () => {
    const numRef = ref(1);
    const objRef = ref({
      a: 'a',
    });
    const normalObj = {
      a: 'a',
    };

    expect(unRef(numRef)).toBe(1);
    expect(unRef(objRef)).toEqual({ a: 'a' });
    expect(unRef(normalObj)).toEqual({ a: 'a' });
  });
  test('proxyRefs', () => {
    const obj = {
      name: 'john',
      age: ref(18),
    };
    const proxyRef = proxyRefs(obj);

    expect(isRef(obj.age)).toBe(true);
    expect(obj.age.value).toBe(18);
    expect(proxyRef.age).toBe(18);

    obj.age.value = 19;

    expect(proxyRef.age).toBe(19);

    proxyRef.age = 20;

    expect(obj.age.value).toBe(20);
    expect(proxyRef.age).toBe(20);

    proxyRef.age = ref('change type');

    expect(obj.age.value).toBe('change type');
    expect(proxyRef.age).toBe('change type');
  });
});
