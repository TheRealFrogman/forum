
export class UpdateThreadDto {
   constructor(
      public description?: string,
      public title?: string,
      public category_id?: string
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
         },
         category_id: {
            type: "string",
            minLength: 0,
            "pattern": "[0-9]+"
         },
      },
      "anyOf": [
         { "required": ["description"] },
         { "required": ["title"] },
         { "required": ["category_id"] },
      ],
      additionalProperties: false
   }
}
