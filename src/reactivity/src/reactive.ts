import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers';

export const reactiveMap = new WeakMap(); // 用来缓存已经创建过的正常的reactive
export const readonlyMap = new WeakMap(); // 用来缓存已经创建过的readonly
export const shallowReadonlyMap = new WeakMap(); // 用来缓存已经创建过的shallowReadonly

// 建立一组枚举 这些是用来存放被代理过后的对象内部的特有的属性 一般用来判断是否是响应或只读数据 或者被代理的原始的数据的
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_RAW = '__v_raw',
}

// 创建一个正常的reactive数据
export function reactive(target) {
  // 当用户使用reactive的时候 就会返回一个创建的reactive的对象
  return createReactiveObject(target, reactiveMap, mutableHandlers);
}

// 创建一个readonly类型的数据
export function readonly(target) {
  // 当用户使用readonly的时候 就会返回一个创建的readonly的对象
  return createReactiveObject(target, readonlyMap, readonlyHandlers);
}

// 创建一个shallowReadonly类型的数据
export function shallowReadonly(target) {
  // 当用户使用shallowReadonly的时候 就会返回一个创建的shallowReadonly的对象
  return createReactiveObject(target, shallowReadonlyMap, shallowReadonlyHandlers);
}

// 判断是否是一个响应式对象
export function isReactive(value) {
  // 通过ReactiveFlags的枚举来判断
  // 如果value是一个响应式的对象的话 会触发getter 在触发getter的时候 已经对这些枚举进行了处理
  // 如果value是一个普通对象的话 就会返回undefined
  // 然后把它在转成布尔值
  return !!value[ReactiveFlags.IS_REACTIVE];
}

// 判断是否是只读数据
export function isReadonly(value) {
  // 同 isReactive
  return !!value[ReactiveFlags.IS_READONLY];
}

// 得到当前响应对象的原始对象
export function toRaw(value) {
  // 这里同理使用ReactiveFlags枚举来判断
  // 如果value是一个响应式数据 则会走getter 在getter里做了处理 会把对应的原始对象给返回出来
  // 如果value是一个普通对象的话 则返回当前的value
  if (!value[ReactiveFlags.IS_RAW]) {
    return value;
  }

  return value[ReactiveFlags.IS_RAW];
}

// 创建reactive对象的方法单独抽离 以便共用逻辑
function createReactiveObject(target, proxyMap, baseHandlers) {
  console.log('createReactiveObject=====>', target);

  // 首先在缓存列表里查找是否存在这个reactive
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);

  return proxy;
}
