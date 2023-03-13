import { describe, it } from "mocha";
import { expect } from "chai";
import { inferSchema } from '../src/index';
import { Schema } from 'mongoose';
import { InferFromSingleObjectOptions } from '../src/config/inferConfigFromObject';
import { Decimal128ConversionRules, isBigIntParseableString } from '../src/schemaTypes/decimal128';

describe('DECIMAL128 SINGLE OBJECT INFERENCE', () => {
  it('should convert an integer to Decimal128 if the corresponding rule is set in options', () => {
    const testObject = { testProperty: 2147483647 };
    const testOptions: InferFromSingleObjectOptions<{ testProperty: Number }> = {
      decimal128ConversionRules: [Decimal128ConversionRules.convertIntegerToDecimal128]
    }

    const generatedSchemaTree = (inferSchema(testObject, testOptions) as any).tree;
    
    const expectedSchemaTree = (new Schema({
      testProperty: { type: Schema.Types.Decimal128, required: true },
    }) as any).tree
    
    expect('testProperty' in generatedSchemaTree).to.equal(true);
    expect(generatedSchemaTree.testProperty.type.name).to.equal(expectedSchemaTree.testProperty.type.name);
    expect(generatedSchemaTree.testProperty.required).to.equal(expectedSchemaTree.testProperty.required);
    expect(generatedSchemaTree.testProperty.default?.toString()).to.equal(undefined)
  })

  it('should convert an integer parseable string to Decimal128 if the corresponding rule is set in options', () => {
    const testObject = {
      testProperty: Number.MAX_SAFE_INTEGER.toString()
    };
    const testOptions: InferFromSingleObjectOptions<{ testProperty: String }> = {
      decimal128ConversionRules: [Decimal128ConversionRules.convertIntegerParseableStringsToDecimal128]
    }

    const generatedSchemaTree = (inferSchema(testObject, testOptions) as any).tree;
    
    const expectedSchemaTree = (new Schema({
      testProperty: { type: Schema.Types.Decimal128, required: true },
    }) as any).tree

    expect('testProperty' in generatedSchemaTree).to.equal(true);
    expect(generatedSchemaTree.testProperty.type.name).to.equal(expectedSchemaTree.testProperty.type.name);
    expect(generatedSchemaTree.testProperty.required).to.equal(expectedSchemaTree.testProperty.required);
    expect(generatedSchemaTree.testProperty.default?.toString()).to.equal(undefined)
  })

  it('should not convert an invalid string (ie not parseable to an integer) to Decimal128 if the corresponding rule is set in options', () => {
    const testObject = {
      testProperty1: '1.2345',
      testProperty2: `999${Number.MAX_SAFE_INTEGER.toString()}`
    };
    const testOptions: InferFromSingleObjectOptions<{ testProperty1: String, testProperty2: String }> = {
      decimal128ConversionRules: [Decimal128ConversionRules.convertIntegerParseableStringsToDecimal128]
    }

    const generatedSchemaTree = (inferSchema(testObject, testOptions) as any).tree;
    
    const expectedSchemaTree = (new Schema({
      testProperty1: { type: String, required: true },
      testProperty2: { type: String, required: true },
    }) as any).tree
    
    expect('testProperty1' in generatedSchemaTree).to.equal(true);
    expect(generatedSchemaTree.testProperty1.type.name).to.equal(expectedSchemaTree.testProperty1.type.name);
    expect(generatedSchemaTree.testProperty1.required).to.equal(expectedSchemaTree.testProperty1.required);
    expect(generatedSchemaTree.testProperty1.default?.toString()).to.equal(undefined)
    expect('testProperty2' in generatedSchemaTree).to.equal(true);
    expect(generatedSchemaTree.testProperty2.type.name).to.equal(expectedSchemaTree.testProperty2.type.name);
    expect(generatedSchemaTree.testProperty2.required).to.equal(expectedSchemaTree.testProperty2.required);
    expect(generatedSchemaTree.testProperty2.default?.toString()).to.equal(undefined)
  })
  
  it('should convert a decimal to Decimal128 if the corresponding rule is set in options', () => {
    const testObject = {
      testProperty: 1.23456
    };
    const testOptions: InferFromSingleObjectOptions<{ testProperty: Number }> = {
      decimal128ConversionRules: [Decimal128ConversionRules.convertDecimalToDecimal128]
    }

    const generatedSchemaTree = (inferSchema(testObject, testOptions) as any).tree;
    
    const expectedSchemaTree = (new Schema({
      testProperty: { type: Schema.Types.Decimal128, required: true },
    }) as any).tree
    
    expect('testProperty' in generatedSchemaTree).to.equal(true);
    expect(generatedSchemaTree.testProperty.type.name).to.equal(expectedSchemaTree.testProperty.type.name);
    expect(generatedSchemaTree.testProperty.required).to.equal(expectedSchemaTree.testProperty.required);
    expect(generatedSchemaTree.testProperty.default?.toString()).to.equal(undefined)
  })

  it('should convert a decimal parseable string to Decimal128 if the corresponding rule is set in options', () => {
    const testObject = {
      testProperty: "1.23456"
    };
    const testOptions: InferFromSingleObjectOptions<{ testProperty: String }> = {
      decimal128ConversionRules: [Decimal128ConversionRules.convertDecimalParseableStringsToDecimal128]
    }

    const generatedSchemaTree = (inferSchema(testObject, testOptions) as any).tree;
    
    const expectedSchemaTree = (new Schema({
      testProperty: { type: Schema.Types.Decimal128, required: true },
    }) as any).tree
    
    expect('testProperty' in generatedSchemaTree).to.equal(true);
    expect(generatedSchemaTree.testProperty.type.name).to.equal(expectedSchemaTree.testProperty.type.name);
    expect(generatedSchemaTree.testProperty.required).to.equal(expectedSchemaTree.testProperty.required);
    expect(generatedSchemaTree.testProperty.default?.toString()).to.equal(undefined)
  })

  it('should not convert an invalid string (ie not parseable to a decimal) to Decimal128 if the corresponding rule is set in options', () => {
    const testObject = {
      testProperty1: "1.23.456",
      testProperty2: "123456"
    };
    const testOptions: InferFromSingleObjectOptions<{ testProperty1: String, testProperty2: String }> = {
      decimal128ConversionRules: [Decimal128ConversionRules.convertDecimalParseableStringsToDecimal128]
    }

    const generatedSchemaTree = (inferSchema(testObject, testOptions) as any).tree;
    
    const expectedSchemaTree = (new Schema({
      testProperty1: { type: String, required: true },
      testProperty2: { type: String, required: true },
    }) as any).tree
    
    expect('testProperty1' in generatedSchemaTree).to.equal(true);
    expect(generatedSchemaTree.testProperty1.type.name).to.equal(expectedSchemaTree.testProperty1.type.name);
    expect(generatedSchemaTree.testProperty1.required).to.equal(expectedSchemaTree.testProperty1.required);
    expect(generatedSchemaTree.testProperty1.default?.toString()).to.equal(undefined);
    expect('testProperty2' in generatedSchemaTree).to.equal(true);
    expect(generatedSchemaTree.testProperty2.type.name).to.equal(expectedSchemaTree.testProperty2.type.name);
    expect(generatedSchemaTree.testProperty2.required).to.equal(expectedSchemaTree.testProperty2.required);
    expect(generatedSchemaTree.testProperty2.default?.toString()).to.equal(undefined);
    
  })
  
    
  it('should convert a BigInt to Decimal128 if the corresponding rule is set in options', () => {
    const testObject = {
      testProperty: BigInt(123456)
    };
    const testOptions: InferFromSingleObjectOptions<{ testProperty: BigInt }> = {
      decimal128ConversionRules: [Decimal128ConversionRules.convertBigintToDecimal128]
    }

    const generatedSchemaTree = (inferSchema(testObject, testOptions) as any).tree;
    
    const expectedSchemaTree = (new Schema({
      testProperty: { type: Schema.Types.Decimal128, required: true },
    }) as any).tree
    
    expect('testProperty' in generatedSchemaTree).to.equal(true);
    expect(generatedSchemaTree.testProperty.type.name).to.equal(expectedSchemaTree.testProperty.type.name);
    expect(generatedSchemaTree.testProperty.required).to.equal(expectedSchemaTree.testProperty.required);
    expect(generatedSchemaTree.testProperty.default?.toString()).to.equal(undefined)
  })

  it('should convert a BigInt parseable string to Decimal128 if the corresponding rule is set in options', () => {
    const testObject = {
      testProperty: "9223372036854775806"
    };
    const testOptions: InferFromSingleObjectOptions<{ testProperty: String }> = {
      decimal128ConversionRules: [Decimal128ConversionRules.convertBigintParseableStringsToDecimal128]
    }

    const generatedSchemaTree = (inferSchema(testObject, testOptions) as any).tree;
    
    const expectedSchemaTree = (new Schema({
      testProperty: { type: Schema.Types.Decimal128, required: true },
    }) as any).tree
    
    expect('testProperty' in generatedSchemaTree).to.equal(true);
    expect(generatedSchemaTree.testProperty.type.name).to.equal(expectedSchemaTree.testProperty.type.name);
    expect(generatedSchemaTree.testProperty.required).to.equal(expectedSchemaTree.testProperty.required);
    expect(generatedSchemaTree.testProperty.default?.toString()).to.equal(undefined)
  })

  it('should not convert an invalid string (ie not parseable to a BigInt) to Decimal128 if the corresponding rule is set in options', () => {
    const testObject = {
      testProperty1: "1.23.456",
      testProperty2: "123456"
    };
    const testOptions: InferFromSingleObjectOptions<{ testProperty1: String, testProperty2: String }> = {
      decimal128ConversionRules: [Decimal128ConversionRules.convertDecimalParseableStringsToDecimal128]
    }

    const generatedSchemaTree = (inferSchema(testObject, testOptions) as any).tree;
    
    const expectedSchemaTree = (new Schema({
      testProperty1: { type: String, required: true },
      testProperty2: { type: String, required: true },
    }) as any).tree
    
    expect('testProperty1' in generatedSchemaTree).to.equal(true);
    expect(generatedSchemaTree.testProperty1.type.name).to.equal(expectedSchemaTree.testProperty1.type.name);
    expect(generatedSchemaTree.testProperty1.required).to.equal(expectedSchemaTree.testProperty1.required);
    expect(generatedSchemaTree.testProperty1.default?.toString()).to.equal(undefined);
    expect('testProperty2' in generatedSchemaTree).to.equal(true);
    expect(generatedSchemaTree.testProperty2.type.name).to.equal(expectedSchemaTree.testProperty2.type.name);
    expect(generatedSchemaTree.testProperty2.required).to.equal(expectedSchemaTree.testProperty2.required);
    expect(generatedSchemaTree.testProperty2.default?.toString()).to.equal(undefined);
  })
  
})
