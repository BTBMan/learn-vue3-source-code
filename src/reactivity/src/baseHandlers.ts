import { ReactiveFlags, reactiveMap } from './reactive';
import { isObject } from '../../shared';
import { reactive } from '.';

const set = createSetter(); // 每一种reactive类型的setter逻辑都是一样的
// 然而不同的reactive类型的getter逻辑是有区别的
const get = createGetter();

// 创建proxy的getter和setter方法 这里抽离出来的目的是为了方便创建其他类型的reactive劫持
function createGetter(isReadonly = false, shallow = false) {
  return function (target, key, receiver) {
    // 这里是处理特殊属性的getter (是否是响应或只读数据 或者获取被代理的原始数据)
    const isExistInReactiveMap = () =>
      key === ReactiveFlags.IS_RAW && receiver === reactiveMap.get(target);

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (isExistInReactiveMap()) {
      return target;
    }

    // 如果访问的不是特殊属性的话 以下为处理正常的数据

    const res = Reflect.get(target, key, receiver);

    if (isObject(res)) {
      // 这里的作用是 当访问一个嵌套的对象的话 再次把它变为响应式的数据 并且返回
      // isReadonly ?
      return reactive(res);
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

// 这个用来处理我们正常创建的reactive的劫持
export const mutableHandlers = {
  get,
  set,
};
