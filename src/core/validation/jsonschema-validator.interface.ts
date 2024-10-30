import { JsonschemaValidationError } from "./jsonschema-validation-error";

export interface IJsonschemaValidator {
   validateBySchema(instance: object, schema: object): JsonschemaValidationError[]
}