import { mutableHandlers } from './baseHandlers';

export const reactiveMap = new WeakMap(); // 用来缓存已经创建过的reactive

// 建立一组枚举 这些是用来存放被代理过后的对象内部的特有的属性 一般用来判断是否是响应或只读数据 或者被代理的原始的数据的
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_RAW = '__v_raw',
}

export function reactive(target) {
  // 当用户使用reactive的时候 就会返回一个创建的reactive的对象
  return createReactiveObject(target, reactiveMap, mutableHandlers);
}

// 创建reactive对象的方法单独抽离 以便共用逻辑
function createReactiveObject(target, proxyMap, baseHandlers) {
  // 首先在缓存列表里查找是否存在这个reactive
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);

  return proxy;
}
