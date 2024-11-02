import { JsonschemaValidationError } from "@/core/jsonschema-validation/jsonschema-validation-error";
import { IJsonschemaValidator } from "@/core/jsonschema-validation/jsonschema-validator.interface";

export interface IValidatorFactory<T> {
   create(props: object): T | JsonschemaValidationError[];
}
interface IModel<T> {
   schema: object; // JSON Schema
   new(props: T): T; // Constructor signature
}

export class GenericValidatorFactory<T> implements IValidatorFactory<T> {
   constructor(
      private jsonschemaValidator: IJsonschemaValidator,
      private model: IModel<T> // Pass the Model class itself
   ) { }

   create(props: object): T | JsonschemaValidationError[] {
      const errors = this.jsonschemaValidator.validateBySchema(props, this.model.schema);
      return errors ? errors : new this.model(props as T);
   }
}