import { AggregateJsonschemaValidationError } from "./jsonschema-validation-error";

export interface IJsonschemaValidator {
   validateBySchema(instance: object, schema: object): AggregateJsonschemaValidationError
}