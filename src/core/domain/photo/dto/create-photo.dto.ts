import { Comment } from "@/core/domain/comment/entities/comment.entity";
import { Thread } from "@/core/domain/thread/entities/thread.entity";

export class CreatePhotoDto {
   constructor(
      public link: string,
      public target_type: 'thread' | 'comment',
      public target_id: Thread['id'] | Comment['id'],
   ) { }

   static schema = {
      title: "CreatePhotoDto",
      type: "object",
      properties: {
         link: {
            type: "string",
            minLength: 4,
            maxLength: 255
         },
         target_type: {
            type: "string",
            enum: ['thread', 'comment']
         },
         target_id: {
            type: "string",
            minimum: 0
         }
      },
      required: ["link", "target_type", "target_id"],
      additionalProperties: false
   }
}
