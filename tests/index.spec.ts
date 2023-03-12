import { describe, it } from "mocha";
import { expect } from "chai";
import { inferSchema } from '../src/index';
import { TestClass, TestClassInterface } from './TestClass';
import mongoose, { Model, Schema } from 'mongoose';
import { Decimal128, ObjectId } from "bson";

describe('CLASS CONSTRUCTOR INFERENCE', () => {
    it('should throw an error given a class constructor as input', () => {    
    let error: unknown;
    let generatedSchemaTree;
    try {
      generatedSchemaTree = (inferSchema(TestClass) as any).tree;
    } catch (e) {
      error = e;
    }
    expect((error as Error).message).to.equal("Unable to infer schema from provided input - inference from Class is not yet implemented.");
    expect(generatedSchemaTree).to.equal(undefined)
  })

})

describe('FUNCTION INFERENCE', () => {
  it('should throw an error given a hoisted function as input', () => {
      function testObjectFunction() {
        return {
          firstName: "Jay",
          lastName: "Clark"
        }
      };
    
    let error: unknown;
    let generatedSchemaTree;
    try {
      generatedSchemaTree = (inferSchema(testObjectFunction) as any).tree;
    } catch (e) {
      error = e;
    }
    expect((error as Error).message).to.equal("Unable to infer schema from provided input - inference from Function is not yet implemented.");
    expect(generatedSchemaTree).to.equal(undefined)
  })

  it('should throw an error given a fat arrow function as input', () => {
    const testObjectFunction = () => ({
      firstName: "Jay",
      lastName: "Clark"
    });
    
    let error: unknown;
    let generatedSchemaTree;
    try {
      generatedSchemaTree = (inferSchema(testObjectFunction) as any).tree;
    } catch (e) {
      error = e;
    }
    expect((error as Error).message).to.equal("Unable to infer schema from provided input - inference from Function is not yet implemented.");
    expect(generatedSchemaTree).to.equal(undefined)
  })

  it('should throw an error given a function variable as input', () => {
    const testObjectFunction = function () {
      return {
        firstName: "Jay",
        lastName: "Clark"
      }
    };
    
    let error: unknown;
    let generatedSchemaTree;
    try {
      generatedSchemaTree = (inferSchema(testObjectFunction) as any).tree;
    } catch (e) {
      error = e;
    }
    expect((error as Error).message).to.equal("Unable to infer schema from provided input - inference from Function is not yet implemented.");
    expect(generatedSchemaTree).to.equal(undefined)
  })

})

describe('ARRAY OF SAMPLE OBJECTS INFERENCE', () => {
    it('should throw an error given a class constructor as input', () => {
    const testObject1 = new TestClass('name1', 100 );
    const testObject2 = new TestClass('name1', 200);
    
    
    let error: unknown;
    let generatedSchemaTree;
    try {
      generatedSchemaTree = (inferSchema([testObject1, testObject2]) as any).tree;
    } catch (e) {
      error = e;
    }
    expect((error as Error).message).to.equal("Unable to infer schema from provided input - inference from Array of Sample Objects is not yet implemented.");
    expect(generatedSchemaTree).to.equal(undefined)
  })

})

describe('SINGLE OBJECT INFERENCE', () => {
    it('should generate a valid schema given a valid sample object as input', () => {
    const testObject = new TestClass('name1', 100, );

    const generatedSchemaTree = (inferSchema(testObject) as any).tree;
    
    let error = false;
    let userModel;
    try {
      userModel = mongoose.model('Sample1', generatedSchemaTree);
    } catch (e) {
      error = true;
    }
    expect(error).to.equal(false);

  })
  
  it('should throw an error given an invalid sample object as input', () => {
    const testObject = {};

    
    let error: Error = {} as Error;
    let generatedSchemaTree: any;
    try {
      generatedSchemaTree = (inferSchema(testObject) as any).tree;
    } catch (e) {
      error = e;
    }
    expect(error.message).to.equal("Unable to infer schema from provided input - argument is not a valid Sample Object.");
  })
  
  it('should infer correct schema from simple sample object', () => {
    const testObject = new TestClass('name1', 100, );
    const expectedSchemaTree = (new Schema({
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
    }) as any).tree

    const generatedSchemaTree = (inferSchema(testObject) as any).tree;
    
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

    const expectedSchemaTree = (new Schema({
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
    }) as any).tree

    const generatedSchemaTree = (inferSchema(testObject, { defaultValues: (defaultValues as any) } ) as any).tree;
    
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

    const expectedSchemaTree = (new Schema({
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
    }) as any).tree

    const generatedSchemaTree = (inferSchema(testObject, { stronglyTypeArrays }) as any).tree;

    const expectedKeys = Object.keys(expectedSchemaTree);
    expectedKeys.forEach((key) => {
      expect(key in generatedSchemaTree).to.equal(true);
      expect(generatedSchemaTree[key].type.name).to.equal(expectedSchemaTree[key].type.name);
      expect(generatedSchemaTree[key].required).to.equal(expectedSchemaTree[key].required);
    })
  })


  
})

describe('INVALID INPUT', () => {
  it('should throw an error given a string as input', () => {

    let error: unknown;
    let generatedSchemaTree;
    try {
      generatedSchemaTree = (inferSchema("abc") as any).tree;
    } catch (e) {
      error = e;
    }
    expect((error as Error).message).to.equal("Unable to infer schema from provided input. Please provide a valid argument: Sample Object.");
    expect(generatedSchemaTree).to.equal(undefined)
  })

  it('should throw an error given a number as input', () => {

    let error: unknown;
    let generatedSchemaTree;
    try {
      generatedSchemaTree = (inferSchema(123) as any).tree;
    } catch (e) {
      error = e;
    }
    expect((error as Error).message).to.equal("Unable to infer schema from provided input. Please provide a valid argument: Sample Object.");
    expect(generatedSchemaTree).to.equal(undefined)
  })

  it('should throw an error given a boolean as input', () => {

    let error: unknown;
    let generatedSchemaTree;
    try {
      generatedSchemaTree = (inferSchema(true) as any).tree;
    } catch (e) {
      error = e;
    }
    expect((error as Error).message).to.equal("Unable to infer schema from provided input. Please provide a valid argument: Sample Object.");
    expect(generatedSchemaTree).to.equal(undefined)
  })

  it('should throw an error given null as input', () => {

    let error: unknown;
    let generatedSchemaTree;
    try {
      generatedSchemaTree = (inferSchema(null) as any).tree;
    } catch (e) {
      error = e;
    }
    expect((error as Error).message).to.equal("Unable to infer schema - input is null.");
    expect(generatedSchemaTree).to.equal(undefined)
  })

  it('should throw an error given undefined as input', () => {

    let error: unknown;
    let generatedSchemaTree;
    try {
      generatedSchemaTree = (inferSchema(undefined) as any).tree;
    } catch (e) {
      error = e;
    }
    expect((error as Error).message).to.equal("Unable to infer schema - input is undefined.");
    expect(generatedSchemaTree).to.equal(undefined)
  })

  it('should throw an error given bigint as input', () => {

    let error: unknown;
    let generatedSchemaTree;
    try {
      generatedSchemaTree = (inferSchema(BigInt(1)) as any).tree;
    } catch (e) {
      error = e;
    }
    expect((error as Error).message).to.equal("Unable to infer schema from provided input. Please provide a valid argument: Sample Object.");
    expect(generatedSchemaTree).to.equal(undefined)
  })

  it('should throw an error given symbol as input', () => {

    let error: unknown;
    let generatedSchemaTree;
    try {
      generatedSchemaTree = (inferSchema(Symbol("foo")) as any).tree;
    } catch (e) {
      error = e;
    }
    expect((error as Error).message).to.equal("Unable to infer schema from provided input. Please provide a valid argument: Sample Object.");
    expect(generatedSchemaTree).to.equal(undefined)
  })

})