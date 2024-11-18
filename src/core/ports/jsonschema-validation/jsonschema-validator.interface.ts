import { AggregateJsonschemaValidationError } from "./jsonschema-validation-error";

export abstract class IJsonschemaValidator {
   abstract assertBySchemaOrThrow<T extends object>(instance: object, schema: object): [T, null] | [null, AggregateJsonschemaValidationError]
}