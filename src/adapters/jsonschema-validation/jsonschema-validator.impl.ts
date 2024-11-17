import { AggregateJsonschemaValidationError, JsonschemaPropertyValidationError } from "@/core/ports/jsonschema-validation/jsonschema-validation-error";
import { IJsonschemaValidator } from "@/core/ports/jsonschema-validation/jsonschema-validator.interface";
import assert from "assert";
import { Validator as Validator_jsonschema } from "jsonschema";

export class JsonSchemaValidator implements IJsonschemaValidator {
   assertBySchemaOrThrow<T extends object>(instance: object, schema: object): asserts instance is T {

      const v = new Validator_jsonschema();
      const result = v.validate(instance, schema);

      if (result.errors.length) {
         var validationErrors = result.errors.map(err => new JsonschemaPropertyValidationError(err.property + " " + err.message, err.property));
         assert(result.schema.title);
         throw new AggregateJsonschemaValidationError("Validation failed", result.schema.title, schema, validationErrors ?? []);
      }
   }
}