export class CreateCommentDto {
   constructor(
      public content: string,
      public thread_id: string,
      public author_id: string,
   ) { }

   static schema = {
      title: "CreateCommentDto",
      type: "object",
      properties: {
         content: {
            type: "string",
         },
         thread_id: {
            type: "string",
            minimum: 0
         },
         author_id: {
            type: "string",
            minimum: 0
         }
      },
      required: ["content", "thread_id", "author_id"],
      additionalProperties: false
   }
}
