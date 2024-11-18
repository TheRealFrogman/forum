import { AggregateJsonschemaValidationError, JsonschemaPropertyValidationError } from "@/core/ports/jsonschema-validation/jsonschema-validation-error";
import { IJsonschemaValidator } from "@/core/ports/jsonschema-validation/jsonschema-validator.interface";
import assert from "assert";
import { injectable } from "inversify";
import { Validator as Validator_jsonschema } from "jsonschema";

@injectable()
export class JsonSchemaValidator implements IJsonschemaValidator {
   assertBySchemaOrThrow<T extends object>(instance: object, schema: object): [T, null] | [null, AggregateJsonschemaValidationError] {

      const v = new Validator_jsonschema();
      const result = v.validate(instance, schema);

      if (result.errors.length) {
         var validationErrors = result.errors.map(err => new JsonschemaPropertyValidationError(err.property + " " + err.message, err.property));
         assert(result.schema.title);
         return [null, new AggregateJsonschemaValidationError("Validation failed", result.schema.title, schema, validationErrors ?? [])];
      } else
         return [instance as T, null]
   }
}