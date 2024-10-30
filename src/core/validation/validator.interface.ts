import { ValidationError } from "./validation-error";

export interface IValidator {
   validateBySchema(instance: object, schema: object): ValidationError[]
}