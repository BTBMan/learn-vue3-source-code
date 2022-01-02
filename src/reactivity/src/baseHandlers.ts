import { ReactiveFlags, reactiveMap, readonly, readonlyMap, shallowReadonlyMap } from './reactive';
import { isObject } from '../../shared';
import { reactive } from '.';

const set = createSetter();
const get = createGetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

// 创建proxy的getter和setter方法 这里抽离出来的目的是为了方便创建其他类型的reactive劫持
function createGetter(isReadonly = false, shallow = false) {
  return function (target, key, receiver) {
    // 这里是处理特殊属性的getter (是否是响应或只读数据 或者获取被代理的原始数据)
    // 这几个函数的作用是和获取被代理对象的原始数据有关的
    const isExistInReactiveMap = () =>
      key === ReactiveFlags.IS_RAW && receiver === reactiveMap.get(target);
    const isExistInReadonlyMap = () =>
      key === ReactiveFlags.IS_RAW && receiver === readonlyMap.get(target);
    const isExistInShallowReadonlyMap = () =>
      key === ReactiveFlags.IS_RAW && receiver === shallowReadonlyMap.get(target);

    console.log('getter======>', target, key, receiver);

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    } else if (isExistInReactiveMap() || isExistInReadonlyMap() || isExistInShallowReadonlyMap()) {
      return target;
    }

    // 如果访问的不是特殊属性的话 以下为处理正常的数据
    const res = Reflect.get(target, key, receiver);

    // readyonly类型的数据是不会出发依赖的 所以不用收集
    if (!isReadonly) {
      // TODO 依赖收集操作
    }

    // 如果是shallow类型的话就直接返回得到的数据
    // shllow 顾名思义 就是浅的意思
    // 如果创建的是shllowReadonly的话 那么他具有以下的特性
    // 1. 不收集依赖 2. 只有对象的第一层是只读的 深层的都是可以修改的
    // 如果创建的是shallowReactive的话 那么他具有以下的特性
    // 1. 只有第一层是具有响应的数据 深层的都不具有响应性 2. 也仅仅是第一层才收集依赖
    if (shallow) {
      console.log('shallow===========>', res);

      return res;
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

// 这个用来处理我们创建的shallowReadonly的劫持, shallow 顾名思义 就是浅的意思 这里的readonly只是浅层的只读
export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set(target, key) {
    // shallowReadonly的值不可以被更改
    console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);

    return true;
  },
};
