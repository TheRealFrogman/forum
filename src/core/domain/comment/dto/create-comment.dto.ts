import { Thread } from "@/core/domain/thread/entities/thread.entity";

export class CreateCommentDto {
   constructor(
      public content: string,
      public thread_id: Thread['id'],
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
            "pattern": "^[0-9]+$"
         },
      },
      required: ["content", "thread_id"],
      additionalProperties: false
   }
}
