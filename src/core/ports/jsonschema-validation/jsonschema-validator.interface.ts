import { AggregateJsonschemaValidationError } from "./jsonschema-validation-error";

export abstract class IJsonschemaValidator {
   abstract assertBySchema<T extends object>(instance: object, schema: object): [T, null] | [null, AggregateJsonschemaValidationError]
}