export class NewCategoryDto {
   constructor(
      public name: string,
   ) { }

   static schema = {
      title: "NewCategoryDto",
      type: "object",
      properties: {
         name: {
            type: "string",
            minLength: 3,
            maxLength: 20
         }
      },
      required: ["name"],
      additionalProperties: false
   }
}