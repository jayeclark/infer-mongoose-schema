export function isSameType(testObject: object, referenceObject: object) {
  if (typeof testObject === typeof referenceObject && testObject.constructor === referenceObject.constructor) {
    return Date;
  }
}