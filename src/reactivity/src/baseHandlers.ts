import { ReactiveFlags, reactiveMap, readonly, readonlyMap } from './reactive';
import { isObject } from '../../shared';
import { reactive } from '.';

const set = createSetter();
const get = createGetter();
const readonlyGet = createGetter(true);

// 创建proxy的getter和setter方法 这里抽离出来的目的是为了方便创建其他类型的reactive劫持
function createGetter(isReadonly = false, shallow = false) {
  return function (target, key, receiver) {
    // 这里是处理特殊属性的getter (是否是响应或只读数据 或者获取被代理的原始数据)
    const isExistInReactiveMap = () =>
      key === ReactiveFlags.IS_RAW && receiver === reactiveMap.get(target);
    const isExistInReadonlyMap = () =>
      key === ReactiveFlags.IS_RAW && receiver === readonlyMap.get(target);

    console.log('getter======>', target, key, receiver);

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    } else if (isExistInReactiveMap() || isExistInReadonlyMap()) {
      return target;
    }

    // 如果访问的不是特殊属性的话 以下为处理正常的数据
    const res = Reflect.get(target, key, receiver);

    // readyonly类型的数据是不会出发依赖的 所以不用收集
    if (!isReadonly) {
      // TODO 依赖收集操作
    }

    if (isObject(res)) {
      // 这里的作用是 当访问一个嵌套的对象的话 再次把它变为响应式的数据 并且返回
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}

function createSetter() {
  return function (target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);

    return result;
  };
}

// 这个用来处理我们创建正常的reactive的劫持
export const mutableHandlers = {
  get,
  set,
};

// 这个用来处理我们创建的readonly的劫持
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    // readonly的值不可以被更改
    console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);

    return true;
  },
};
