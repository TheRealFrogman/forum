
export class UpdateThreadDto {
   constructor(
      public description?: string,
      public title?: string
   ) { }

   static schema = {
      title: "CreateThreadDto",
      type: "object",
      properties: {
         description: {
            type: "string",
            minLength: 4,
            maxLength: 255
         },
         title: {
            type: "string",
            minLength: 4,
            maxLength: 255
         }
      },
      "anyOf": [
         { "required": ["description"] },
         { "required": ["title"] }
      ],
      additionalProperties: false
   }
}
