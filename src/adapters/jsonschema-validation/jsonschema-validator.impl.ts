import { AggregateJsonschemaValidationError, JsonschemaPropertyValidationError } from "@/core/ports/jsonschema-validation/jsonschema-validation-error";
import { IJsonschemaValidator } from "@/core/ports/jsonschema-validation/jsonschema-validator.interface";
import assert from "assert";
import { Validator as Validator_jsonschema } from "jsonschema";

export class JsonSchemaValidator implements IJsonschemaValidator {
   validateBySchema(instance: object, schema: object): AggregateJsonschemaValidationError {

      const v = new Validator_jsonschema();
      const result = v.validate(instance, schema);

      if (result.errors) {
         var validationErrors = result.errors.map(err => new JsonschemaPropertyValidationError(err.property + " " + err.message, err.property));
      }

      assert(result.schema.title);
      return new AggregateJsonschemaValidationError("Validation failed", result.schema.title, schema, validationErrors! ?? []);
   }
}