export interface IJsonschemaValidator {
   assertBySchemaOrThrow<T extends object>(instance: object, schema: object): asserts instance is T
}