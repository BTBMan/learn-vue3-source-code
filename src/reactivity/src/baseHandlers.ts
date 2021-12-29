import { ReactiveFlags, reactiveMap } from './reactive';

const set = createSetter(); // 每一种reactive类型的setter逻辑都是一样的
// 然而不同的reactive类型的getter逻辑是有区别的
const get = createGetter();

// 创建proxy的getter和setter方法 这里抽离出来的目的是为了方便创建其他类型的reactive劫持
function createGetter(isReadonly = false, shallow = false) {
  return function (target, key, receiver) {
    // 首先去处理特殊属性的getter (是否是响应或只读数据 或者获取被代理的原始数据)
    // 首先去找当前对象有没有被缓存过
    const isExistInReactiveMap = () =>
      key === ReactiveFlags.IS_RAW && receiver === reactiveMap.get(target);

    return Reflect.get(target, key, receiver);
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
