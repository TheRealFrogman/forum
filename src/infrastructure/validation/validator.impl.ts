import { ValidationError } from "@/core/validation/validation-error";
import { IValidator } from "@/core/validation/validator.interface";
import { Validator as Validator_jsonschema } from "jsonschema";
export class Validator implements IValidator {
   validateBySchema(instance: object, schema: object): ValidationError[] {

      const v = new Validator_jsonschema();
      const result = v.validate(instance, schema);

      if (result.errors) return result.errors.map(err => new ValidationError(err.message));
      else return [];
   }
}