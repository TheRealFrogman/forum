import { AggregateJsonschemaValidationError } from "./jsonschema-validation-error";

export interface IJsonschemaValidator {
   assertBySchemaOrThrow<T extends object>(instance: object, schema: object): [T, null] | [null, AggregateJsonschemaValidationError]
}