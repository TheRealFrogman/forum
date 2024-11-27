import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { User } from "@/core/domain/user/entities/user.entity";

export class CreateCommentDto {
   constructor(
      public content: string,
      public thread_id: Thread['id'],
      public author_id: User['id'],
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
         author_id: {
            type: "string",
            "pattern": "^[0-9]+$"
         }
      },
      required: ["content", "thread_id", "author_id"],
      additionalProperties: false
   }
}
