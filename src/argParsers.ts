import { Class, ObjectLiteralFunction, InferenceOptions } from './types';
import { throwInvalidInputError } from './error';

export function isClassConstructor<T>(arg: Class<T>) {

  let isConstructor: boolean = false;
  let isPrototype: boolean = false;
  try {
    isConstructor = arg.constructor
      && arg.constructor.toString().substring(0, 5) === 'class'
      && typeof arg.constructor === 'function'
    if ('prototype' in arg && arg.prototype === undefined) {
      return isConstructor;
    }

    isPrototype = 'prototype' in arg && arg.prototype.constructor 
    && arg.prototype.constructor.toString
    && arg.prototype.constructor.toString().substring(0, 5) === 'class'
    && typeof arg.prototype.constructor === 'function'
  
  } catch (e) {
    return false;
  }

  return isPrototype
}

export function isFunctionalComponent<T>(arg: ObjectLiteralFunction<T>) {
  return typeof arg === 'function' && (arg as unknown) instanceof Function
}

export function isArrayOfSampleObjects<T>(arg: T[]) {
  const allArrayElementsAreSampleObjects =  Array.isArray(arg) && arg.every((sample: T) => isSingleSampleObject(sample))
  return allArrayElementsAreSampleObjects && arg.length > 0
}

export function isSingleSampleObject<T>(arg: T) {
  const isObject = typeof arg === 'object' && !isClassConstructor<T>(arg as unknown as Class<T>);
  const isValidObject = isObject && Object.keys(arg).filter((key: string) => typeof arg[key as keyof T] !== 'function').length > 0
  if (isObject && !isValidObject) {
    throwInvalidInputError(InferenceOptions.OBJECT)
  }
  return typeof arg === 'object' && !isClassConstructor<T>(arg as unknown as Class<T>)
}