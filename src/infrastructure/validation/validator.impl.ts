import { JsonschemaValidationError } from "@/core/validation/jsonschema-validation-error";
import { IJsonschemaValidator } from "@/core/validation/jsonschema-validator.interface";
import { Validator as Validator_jsonschema } from "jsonschema";
export class JsonSchemaValidator implements IJsonschemaValidator {
   validateBySchema(instance: object, schema: object): JsonschemaValidationError[] {

      const v = new Validator_jsonschema();
      const result = v.validate(instance, schema);

      if (result.errors) return result.errors.map(err => new JsonschemaValidationError(err.message));
      else return [];
   }
}