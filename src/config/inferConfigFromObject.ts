import { MongooseDocument, MongooseModelConstructor, MongooseModelBaseConstructor } from '../types';
import { SchemaPropertyType, SCHEMA_PROPERTY_TYPES } from './configMap';
import { Decimal128, ObjectId } from 'bson';

type Key<T> = (string | number | symbol) & keyof T

export interface InferFromSingleObjectOptions<T> {
  optionalAttributes?: string[];
  defaultValues?: T;
  stronglyTypeArrays?: boolean;
}

export function inferConfigFromObject<T>(object: T, options?: InferFromSingleObjectOptions<T>): MongooseDocument<T> {
  const allNamesAndSymbols: Key<T>[] = (Object.getOwnPropertyNames(object) as Key<T>[])
    .concat(Object.getOwnPropertySymbols(object) as Key<T>[])
    .map((attribute: Key<T>) => String(attribute) as Key<T>)
  const attributes: Key<T>[] = allNamesAndSymbols.filter((key: Key<T>) => typeof object[key] !== 'function')
  const configObject: Record<string | number | symbol, any> = generateConfigObjectFromAttributes(attributes, object, options);

  return configObject;
}

function generateConfigObjectFromAttributes<T>(attributes: Array<(string | number | symbol) & keyof T>, object: T, options?: InferFromSingleObjectOptions<T>) {
  return generateConfigObjectFromAttributesAndNamespace(attributes, object, '', options);
}

function generateConfigObjectFromAttributesAndNamespace<T>(attributes: Array<(string | number | symbol) & keyof T>, object: T, namespace: string, options?: InferFromSingleObjectOptions<T>) {
  const optionalAttributes = options?.optionalAttributes ? new Set(options.optionalAttributes) : null;
  const defaultValues = options?.defaultValues || null;
      
  const configObject: Record<keyof T, any> = {} as T;
  attributes.forEach((attribute: keyof T) => {
    const subNamespace = `${String(namespace)}${namespace ? ":" : ""}${ String(attribute) }`

    const temp: MongooseModelConstructor<MongooseModelBaseConstructor> = {
        "type": getSchemaDefinitionPropertyType(object[attribute], subNamespace, options),
        required: !optionalAttributes || !(optionalAttributes.has(String(attribute)))
    }
    if (defaultValues) {
      temp.default = defaultValues[attribute]
    }
    configObject[attribute] = temp;
  }) 
  return configObject;
}

function getSchemaDefinitionPropertyType<T>(value: any, namespace: string, options?: InferFromSingleObjectOptions<T>) {
  const stronglyTypeArrays = options?.stronglyTypeArrays;

  if (isUndefined(value)) { return SCHEMA_PROPERTY_TYPES[SchemaPropertyType.Mixed] }
  if (isString(value)) { return SCHEMA_PROPERTY_TYPES[SchemaPropertyType.String] }
  if (isNumber(value)) { return SCHEMA_PROPERTY_TYPES[SchemaPropertyType.Number] }
  if (isDate(value)) { return SCHEMA_PROPERTY_TYPES[SchemaPropertyType.Date] }
  if (isBuffer(value)) { return SCHEMA_PROPERTY_TYPES[SchemaPropertyType.Buffer] }
  if (isBoolean(value)) { return SCHEMA_PROPERTY_TYPES[SchemaPropertyType.Boolean] }
  if (isObjectId(value)) { return SCHEMA_PROPERTY_TYPES[SchemaPropertyType.ObjectId] }
  if (isEmptyArray(value) || (isPopulatedArray(value) && !stronglyTypeArrays)) { return SCHEMA_PROPERTY_TYPES[SchemaPropertyType.Array] }
  if (isPopulatedArray(value) && stronglyTypeArrays) { return [getArrayPropertyType(value, namespace, options)] }
  if (isDecimal128(value)) { return SCHEMA_PROPERTY_TYPES[SchemaPropertyType.Decimal128] }
  if (isMap(value)) { return SCHEMA_PROPERTY_TYPES[SchemaPropertyType.Map] }
  if (isObject(value)) {
    return generateConfigObjectFromAttributesAndNamespace(Object.keys(value), value, namespace, options)
  }
}

function isUndefined(value: unknown) {
  return typeof value === 'undefined';
}

function isString(value: unknown) {
  return typeof value === 'string';
}

function isNumber(value: unknown) {
  return typeof value === 'number';
}

function isDate(value: unknown) {
  return typeof value === 'object' && isSameType(value, new Date('01-01-2022')) && value instanceof Date
}

function isBuffer(value: unknown) {
  return typeof value === 'object' && isSameType(value, Buffer.from('123')) && value instanceof Buffer
}

function isBoolean(value: unknown) {
  return typeof value === 'boolean'
}

function isObjectId(value: unknown) {
  return typeof value === 'object' && isSameType(value, new ObjectId(0)) && value instanceof ObjectId
}

function isArray(value: unknown) {
  return typeof value === 'object' && Array.isArray(value);
}

function isEmptyArray(value: unknown) {
  return isArray(value) && (value as Array<any>).length === 0;
}

function isPopulatedArray(value: unknown) {
  return isArray(value) && (value as Array<any>).length > 0;
}

function isDecimal128(value: unknown) {
  return typeof value === 'object' && isSameType(value, Decimal128.fromString('1.23')) && value instanceof Decimal128 
}

function isMap(value: unknown) {
  return typeof value === 'object' && isSameType(value, new Map([["key", "value"]])) && value instanceof Map
}

function isObject(value: unknown) {
  return typeof value === 'object' && !isMap(value) && !isDecimal128(value) && !isBuffer(value) && !isArray(value)
}

function isSameType(testObject: object, referenceObject: object) {
  if (typeof testObject === typeof referenceObject && testObject.constructor === referenceObject.constructor) {
    return Date;
  }
}

function getArrayPropertyType(array: Array<any>, namespace: string, options: InferFromSingleObjectOptions<any>): MongooseModelBaseConstructor {
  const firstType: MongooseModelBaseConstructor = getSchemaDefinitionPropertyType(array[0], namespace);
  if (array.every((element) => getSchemaDefinitionPropertyType(element, namespace, options) === firstType)) {
    return firstType
  }
  return SCHEMA_PROPERTY_TYPES[SchemaPropertyType.Mixed];
}