import { MongooseModelBaseConstructor } from '../types';
import { Schema } from 'mongoose';

/**
 * Schema property types supported by Mongoose 7.0.0
 */
export enum SchemaPropertyType {
  String = "String",
  Number = "Number",
  Date = "Date",
  Buffer = "Buffer",
  Boolean = "Boolean",
  Mixed = "Mixed",
  ObjectId = "ObjectId",
  Array = "Array",
  Decimal128 = "Decimal128",
  Map = "Map"
}

/**
 * Model used to connect schema property types to the function that should be returned in order to generate the schema config.
 */
export const SCHEMA_PROPERTY_TYPES: Record<SchemaPropertyType, MongooseModelBaseConstructor> = {
  [SchemaPropertyType.String]: String,
  [SchemaPropertyType.Number]: Number,
  [SchemaPropertyType.Date]: Date,
  [SchemaPropertyType.Buffer]: Buffer,
  [SchemaPropertyType.Boolean]: Boolean,
  [SchemaPropertyType.Mixed]: Schema.Types.Mixed,
  [SchemaPropertyType.Array]: Array,
  [SchemaPropertyType.ObjectId]: Schema.Types.ObjectId,
  [SchemaPropertyType.Decimal128]: Schema.Types.Decimal128,
  [SchemaPropertyType.Map]: Map
}