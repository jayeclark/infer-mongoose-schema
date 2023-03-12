import { ObtainDocumentType, Schema } from 'mongoose'
import { isClassConstructor, isFunctionalComponent, isArrayOfSampleObjects, isSingleSampleObject } from './argParsers';
import { Class, ObjectLiteralFunction, InferenceOptions, MongooseDocument, MongooseModelObject } from './types';
import { inferConfigFromObject, InferFromSingleObjectOptions } from './config/inferConfigFromObject';
import { throwMethodNotImplementedError, throwInvalidInputError } from './error';

type InferModelOptions<T> = InferFromSingleObjectOptions<T>

const IMPLEMENTED_ARGUMENT_OPTIONS = ["Sample Object"]

/**
 * Mongoose schema inference simplifies the object modeling process by
 * inferring schema configuration based on a sample object and configuration 
 * options, reducing duplicated code.
 */
function inferSchema<T>(arg: T | T[] | Class<T> | ObjectLiteralFunction<T>, options?: InferModelOptions<T>): Schema {
  if (arg == null || arg == undefined) {
    throw new Error(`Unable to infer schema - input is ${arg}.`)
  }

  /**
   * Inference based on class constructors is targeted for implementation in v 1.0.0.
   */
  if (isClassConstructor(arg as Class<T>)) {
     throwMethodNotImplementedError(InferenceOptions.CLASS);
  }

  /**
   * Inference based on functional components or modules is targeted for implementation in v 1.2.0.
   */
  if (isFunctionalComponent(arg as ObjectLiteralFunction<T>)) {
    throwMethodNotImplementedError(InferenceOptions.FUNCTION);
  }

  /**
   * Inference based on an array of sample objects is targeted for implementation in v 1.1.0.
   */
  if (isArrayOfSampleObjects(arg as T[])) {
    throwMethodNotImplementedError(InferenceOptions.ARRAY)
  }

  /**
   * The current 0.0.x versions are limited to inference based on a sample object and associated configuration options.
   */
  if (isSingleSampleObject(arg)) {
    return inferSchemaFromObject<T>(arg as T, options);
  }

  /**
   * Implementations based on anything other than an object, array of objects, class, or function is not planned.
   */
  throw new Error(`Unable to infer schema from provided input. Please provide a valid argument: ${IMPLEMENTED_ARGUMENT_OPTIONS.join(", ")}.`);
}

/**
 * Returns a mongoose schema that can be used to generate a model
 */
function inferSchemaFromObject<T>(object: T, options?: InferFromSingleObjectOptions<T>): Schema {
  const config: MongooseDocument<T> = inferConfigFromObject(object, options);
  return new Schema(config as ObtainDocumentType<Record<string, MongooseModelObject<any>>>);
}

export { inferSchema }