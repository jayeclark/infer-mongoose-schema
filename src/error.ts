import { InferenceOptions } from './types';

export function throwMethodNotImplementedError(method: InferenceOptions) {
  throw new Error(`Unable to infer schema from provided input - inference from ${method} is not yet implemented.`);
}


export function throwInvalidInputError(method: InferenceOptions) {
  throw new Error(`Unable to infer schema from provided input - argument is not a valid ${method}.`);
}
