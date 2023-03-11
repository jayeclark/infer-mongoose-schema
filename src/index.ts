import { ObtainDocumentType, Schema } from 'mongoose'
import { isClassConstructor } from './argParsers';
import { Class, PojoFunction, InferenceOptions, MongooseDocument, MongooseModelObject } from './types';
import { inferConfigFromObject, InferFromSingleObjectOptions } from './config/inferConfigFromObject';

type InferModelOptions<T> = InferFromSingleObjectOptions<T>

function inferSchema<T>(arg: T | T[] | Class<T> | PojoFunction<T>, options?: InferModelOptions<T>): Schema {
  if (isClassConstructor<T>(arg as Class<T>)) {
    //return inferSchemaFromClassConstructor(arg)
     throwMethodNotImplementedError(InferenceOptions.CLASS);
  }

  if (typeof arg === 'function' && arg instanceof Function) {
    // return inferSchemaFromFunction<T>(arg as PojoFunction<T>);
    throwMethodNotImplementedError(InferenceOptions.FUNCTION);
  }

  if (Array.isArray(arg) && arg.length > 0 && typeof arg[0] == 'object' && !isClassConstructor<T>(arg[0] as unknown as Class<T>)) {
    // return inferSchemaFromObjects<T>(arg as T[])
    throwMethodNotImplementedError(InferenceOptions.ARRAY)
  }

  if (typeof arg === 'object') {
    return inferSchemaFromObject<T>(arg as T, options);
  }

  throw new Error("Unable to infer schema from provided input");
}

function throwMethodNotImplementedError(method: InferenceOptions) {
  throw new Error(`Unable to infer schema from provided input - inference from ${method} is not yet implemented`);
}

function inferSchemaFromObject<T>(object: T, options?: InferFromSingleObjectOptions<T>): Schema {
  const config: MongooseDocument<T> = inferConfigFromObject(object, options);
  return new Schema(config as ObtainDocumentType<Record<string, MongooseModelObject<any>>>);
}

export { inferSchema }