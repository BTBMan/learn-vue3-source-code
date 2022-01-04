import { isReactive, isRef, ref, unRef } from '../src';

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
});
