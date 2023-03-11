import { ObjectId, Decimal128 } from 'bson';

export interface TestClassInterface {
  stringProperty: string;
  numberProperty: number;
  bufferProperty: Buffer;
  booleanProperty: boolean;
  mixedProperty: string | number | boolean;
  objectId: ObjectId;
  arrayPropertyWithPrimitives: Array<string>;
  arrayPropertyWithObjects: Array<Record<string, string>>;
  arrayPropertyWithMixed?: Array<string | number>;
  decimal128Property: Decimal128;
  mapProperty: Map<string, string>;
}

export class TestClass implements TestClassInterface {
  stringProperty: string;
  numberProperty: number | undefined;
  bufferProperty: Buffer;
  booleanProperty: boolean;
  mixedProperty: string | number | boolean;
  objectId: ObjectId;
  arrayPropertyWithPrimitives: Array<string> | undefined;
  arrayPropertyWithObjects: Array<Record<string, string>>;
  arrayPropertyWithMixed: Array<string | number>;
  decimal128Property: Decimal128;
  mapProperty: Map<string, string>;

  constructor(
    stringProperty: string,
    numberProperty?: number
  ) {
    this.stringProperty = stringProperty;
    this.numberProperty = numberProperty ?? this.numberProperty;
    this.bufferProperty = Buffer.from("xyz");
    this.booleanProperty = false;
    this.mixedProperty = undefined;
    this.objectId = new ObjectId();
    this.arrayPropertyWithPrimitives = ["string1", "string2"];
    this.arrayPropertyWithObjects = [{ name: "name1" }, { name: "name2" }];
    this.decimal128Property = new Decimal128('1.234');
    this.mapProperty = new Map([["key1", "value1"], ["key2", "value2"]]);
  }

  static staticMethod(a: string) {
    return a;
  }

  instanceMethod(b: number) {
    return b * 2;
  }
}