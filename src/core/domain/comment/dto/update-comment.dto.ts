
export class UpdateCommentDto {
   constructor(
      public content: string
   ) { }

   static schema = {
      title: "UpdateCommentDto",
      type: "object",
      properties: {
         content: {
            type: "string",
         }
      },
      required: ["content"],
      additionalProperties: false
   }
}
