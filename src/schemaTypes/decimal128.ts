import { Decimal128 } from "bson"
import { isSameType } from "./utils"
import { InferFromSingleObjectOptions } from '../config/inferConfigFromObject';

export enum Decimal128ConversionRules {
  convertIntegerToDecimal128,
  convertDecimalToDecimal128,
  convertBigintToDecimal128,
  convertDecimalParseableStringsToDecimal128,
  convertIntegerParseableStringsToDecimal128,
  convertBigintParseableStringsToDecimal128,
  convertDecimal128ParseableStringsToDecimal128
}

export const isDecimal128 = function (value: unknown) {
  return typeof value === 'object' && isSameType(value, Decimal128.fromString('1.23')) && value instanceof Decimal128 
}

// TODO: Add validation of input size similar to bigint and integer
export const isDecimalParseableString = function (value: unknown) {
  return typeof value === 'string' && /^\d*\.\d*$/.test(value) === true && Math.abs(parseFloat(value)) <= Number.MAX_VALUE
}

export const isDecimal = function (value: unknown) {
  return typeof value === 'number' && isDecimalParseableString(value.toString())
}

export const isIntegerParseableString = function (value: unknown) {
  return typeof value === 'string' && /^\d+$/.test(value) === true && Math.abs(parseInt(value)) <= Number.MAX_SAFE_INTEGER
}

export const isInteger = function (value: unknown) {
  return typeof value === 'number' && isIntegerParseableString(value.toString())
}

export const isBigIntParseableString = function (value: unknown) {
  return typeof value === 'string' && /^\d+$/.test(value) === true && BigInt(value) <= BigInt("9223372036854775807");
}

export const isBigInt = function (value: unknown) {
  return typeof value === 'bigint' && isBigIntParseableString(value.toString());
}

export const canConvertToDecimal128 = function (value: unknown) {
  return isDecimal(value) || isInteger(value)
}

// TODO: Implement method for strings which can only be converted to Decimal128 (too large for bigint or float)

export const shouldConvertToDecimal128 = function<T>(value: unknown, options: InferFromSingleObjectOptions<T>) {
  if (!options || 'decimal128ConversionRules' in options === false) return false;
  const rules = new Set(options.decimal128ConversionRules);

  const convert = (isInteger(value) && rules.has(Decimal128ConversionRules.convertIntegerToDecimal128))
    || (isIntegerParseableString(value) && rules.has(Decimal128ConversionRules.convertIntegerParseableStringsToDecimal128))
    || (isDecimal(value) && rules.has(Decimal128ConversionRules.convertDecimalToDecimal128))
    || (isDecimalParseableString(value) && rules.has(Decimal128ConversionRules.convertDecimalParseableStringsToDecimal128))
    || (isBigInt(value) && rules.has(Decimal128ConversionRules.convertBigintToDecimal128))
    || (isBigIntParseableString(value) && rules.has(Decimal128ConversionRules.convertBigintParseableStringsToDecimal128))
  return convert
}