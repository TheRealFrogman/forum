
export class CreateThreadDto {
   constructor(
      public author_id: string,
      public description: string,
      public title: string,
   ) { }

   static schema = {
      title: "CreateThreadDto",
      type: "object",
      properties: {
         author_id: {
            type: "string",
            minLength: 0,
            "pattern": "[0-9]+"
         },
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
      required: ["author_id", "description", "title"],
      additionalProperties: false
   }
}
