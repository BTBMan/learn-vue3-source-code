import { isObject } from '../../shared/index';
import { reactive } from './reactive';

export class RefImpl {
  private _rawValue: any; // 原始数据
  private _value: any; // 被代理的数据
  public __v_isRef: boolean = true; // 用来判断是否是ref数据

  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
  }

  get value() {
    // TODO 这里须要收集依赖
    return this._value;
  }

  set value(newValue) {
    // TODO 这里须要判断一下新设置的是否等于老值
    // 如果不相等的话 则触发依赖
    this._value = convert(newValue);
    this._rawValue = newValue;
  }
}

export function ref(value) {
  return createRef(value);
}

export function createRef(value) {
  const refImpl = new RefImpl(value);

  return refImpl;
}

// 用来转换为响应式对象的方法
export function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

// TODO proxyRefs的实现 它并没有对外暴露 只是为了我们在写模板语法的时候 不用我们写.value

// 判断是否是ref数据
// 很简单 通过value下面的特殊属性判断 如果没有则不是ref数据
// 然后在转换为布尔值返回出去
export function isRef(value) {
  return !!value.__v_isRef;
}

// unref只是个语法糖
// 如果value是个ref类型的数据则返回内部的value 否则返回当前这个value
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}
