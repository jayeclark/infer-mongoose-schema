import { Decimal128, ObjectId } from "mongoose"

export interface Class<T> extends Object {
  ['string']: any;
  constructor: (args: any[]) => void,
  prototype: (args: any[]) => T
}

export interface ObjectLiteralFunction<T> {
  prototype: (args: any[]) => T
}

export enum InferenceOptions {
  CLASS = "Class",
  FUNCTION = "Function",
  ARRAY = "Array of Sample Objects",
  OBJECT = "Sample Object"
}

export type MongooseModelBaseConstructor = StringConstructor | NumberConstructor | DateConstructor | BufferConstructor | BooleanConstructor | {} | ObjectId | ArrayConstructor | Decimal128 | MapConstructor
export type MongooseModelConstructor<T> = {
  "type": T;
  index?: boolean;
  alias?: string;
  default?: T;
  required?: boolean;
}
export type MongooseModelObject<T> = Record<keyof T, MongooseModelBaseConstructor | MongooseModelConstructor<MongooseModelBaseConstructor>>

export type MongooseDocument<T> = MongooseModelObject<T> | Record<string, MongooseModelObject<any>> | Array<MongooseModelObject<any>>