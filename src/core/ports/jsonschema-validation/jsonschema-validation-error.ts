import { HttpError } from "@/core/exceptions/HttpError";

export class JsonschemaPropertyValidationError extends HttpError {
   constructor(
      message: string,
      public validationTarget: string
   ) {
      super(400, message);
      this.name = "JsonschemaValidationError";
   }
   override toJSON() {
      const superJson = super.toJSON()
      const result = {
         ...super.toJSON(),
         validationTarget: this.validationTarget
      }
      // @ts-ignore
      delete result.httpCode;
      return result;
   }
}

export class AggregateJsonschemaValidationError extends HttpError {
   constructor(
      public override message: string,
      public title: string,
      public schema: object,
      public errors: JsonschemaPropertyValidationError[],
   ) {
      super(400, message);
      this.name = "AggregateJsonschemaValidationError";
   }
   get length() { return this.errors.length }
   override toJSON() {
      return {
         ...super.toJSON(),
         errors: this.errors,
         title: this.title,
         schema: this.schema
      }
   }
}