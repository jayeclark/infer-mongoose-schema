import { describe, it } from "mocha";
import { expect } from "chai";
import inferSchema from '../src/index';
import { TestClass, TestClassInterface } from './TestClass';
import mongoose, { Model, Schema } from 'mongoose';
import { Decimal128, ObjectId } from "bson";

describe('SINGLE OBJECT INFERENCE', () => {
    it('should generate a valid schema that can be used to create a model', () => {
    const testObject = new TestClass('name1', 100, );

    const generatedSchemaTree = inferSchema(testObject).tree;
    
    let error = false;
    let userModel;
    try {
      userModel = mongoose.model('Sample', generatedSchemaTree);
    } catch (e) {
      error = true;
    }
    expect(error).to.equal(false);

    })
  
  it('should infer correct schema from simple sample object', () => {
    const testObject = new TestClass('name1', 100, );
    const expectedSchemaTree = new Schema({
      stringProperty: { type: String, required: true },
      numberProperty: { type: Number, required: true },
      bufferProperty: { type: Buffer, required: true },
      booleanProperty: { type: Boolean, required: true },
      mixedProperty: { type: Schema.Types.Mixed, required: true },
      objectId: { type: Schema.Types.ObjectId, required: true },
      arrayPropertyWithPrimitives: { type: Array, required: true },
      arrayPropertyWithObjects: { type: Array, required: true },
      decimal128Property: { type: Schema.Types.Decimal128, required: true },
      mapProperty: { type: Map, required: true },
    }).tree

    const generatedSchemaTree = inferSchema(testObject).tree;
    
    const expectedKeys = Object.keys(expectedSchemaTree);
    expectedKeys.forEach((key) => {
      expect(key in generatedSchemaTree).to.equal(true);
      expect(generatedSchemaTree[key].type.name).to.equal(expectedSchemaTree[key].type.name);
      expect(generatedSchemaTree[key].required).to.equal(expectedSchemaTree[key].required);
    })

  })

  it('should infer correct schema from sample object with default values', () => {
    const testObject = new TestClass('name1', 100);
    
    const testObjectId = new ObjectId(1);
    const testDecimal128 = new Decimal128('0.009');
    const testMap = new Map([["key10", "value10"]]);
    const defaultValues: TestClassInterface = {
      stringProperty: 'defaultStringValue',
      numberProperty: 123,
      bufferProperty: Buffer.from('ree'),
      booleanProperty: true,
      mixedProperty: "whatever",
      objectId: testObjectId,
      arrayPropertyWithPrimitives: ["x", "y"],
      arrayPropertyWithObjects: [{ name: "something" }],
      decimal128Property: testDecimal128,
      mapProperty: testMap
    }

    const expectedSchemaTree = new Schema({
      stringProperty: { type: String, required: true, default: "defaultStringValue" },
      numberProperty: { type: Number, required: true, default: 123 },
      bufferProperty: { type: Buffer, required: true, default: Buffer.from('ree')},
      booleanProperty: { type: Boolean, required: true, default: true },
      mixedProperty: { type: Schema.Types.Mixed, required: true, default: "whatever" },
      objectId: { type: Schema.Types.ObjectId, required: true, default: testObjectId },
      arrayPropertyWithPrimitives: { type: Array, required: true, default: ["x", "y"] },
      arrayPropertyWithObjects: { type: Array, required: true, default: [{ name: "something" }] },
      decimal128Property: { type: Schema.Types.Decimal128, required: true, default: testDecimal128 },
      mapProperty: { type: Map, required: true, default: testMap },
    }).tree

    const generatedSchemaTree = inferSchema(testObject, { defaultValues }).tree;
    
    const expectedKeys = Object.keys(expectedSchemaTree);
    expectedKeys.forEach((key) => {
      expect(key in generatedSchemaTree).to.equal(true);
      expect(generatedSchemaTree[key].type.name).to.equal(expectedSchemaTree[key].type.name);
      expect(generatedSchemaTree[key].required).to.equal(expectedSchemaTree[key].required);
      expect(generatedSchemaTree[key].default?.toString()).to.equal(expectedSchemaTree[key].default?.toString())
    })

  })

  it('should infer correct schema from sample object with strong array typing', () => {
    const testObject = new TestClass('name1', 100);
    
    const stronglyTypeArrays = true;

    const expectedSchemaTree = new Schema({
      stringProperty: { type: String, required: true },
      numberProperty: { type: Number, required: true },
      bufferProperty: { type: Buffer, required: true },
      booleanProperty: { type: Boolean, required: true },
      mixedProperty: { type: Schema.Types.Mixed, required: true },
      objectId: { type: Schema.Types.ObjectId, required: true },
      arrayPropertyWithPrimitives: { type: [ String ], required: true },
      arrayPropertyWithObjects: { type: [ { name: { type: String, required: true }}], required: true },
      decimal128Property: { type: Schema.Types.Decimal128, required: true },
      mapProperty: { type: Map, required: true },
    }).tree

    const generatedSchemaTree = inferSchema(testObject, { stronglyTypeArrays }).tree;

    const expectedKeys = Object.keys(expectedSchemaTree);
    expectedKeys.forEach((key) => {
      expect(key in generatedSchemaTree).to.equal(true);
      expect(generatedSchemaTree[key].type.name).to.equal(expectedSchemaTree[key].type.name);
      expect(generatedSchemaTree[key].required).to.equal(expectedSchemaTree[key].required);
    })
  })


  
})