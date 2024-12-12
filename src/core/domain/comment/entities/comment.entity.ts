import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { User } from "@/core/domain/user/entities/user.entity";

interface CommentProps {
   id: string;
   content: string;
   thread_id: Thread['id'];
   author_id: User['id'];
   rating: number;
   created_at: Date;
   local_id: string;
}

interface CommentInitializer extends CommentProps { }

export class Comment implements CommentProps {
   id!: string;
   content!: string;
   thread_id!: Thread['id'];
   author_id!: User['id'];
   rating!: number;
   created_at!: Date;
   local_id!: string;

   constructor(data: CommentInitializer) {
      if (data) {
         this.id = data.id;
         this.content = data.content;
         this.thread_id = data.thread_id;
         this.author_id = data.author_id;
         this.rating = data.rating
         this.created_at = data.created_at
         this.local_id = data.local_id
      }
   }

   static schema = {
      title: "Comment",
      type: "object",
      properties: {
         id: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
         content: {
            type: "string",
            minLength: 4,
            maxLength: 255
         },
         thread_id: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
         seq: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
         author_id: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
         rating: {
            type: "number",
         },
         created_at: {
            type: "string",
            format: "date-time"
         }
      },
      required: ["id", "content", "thread_id", "author_id", "rating", "created_at", "seq"],
      additionalProperties: false
   }
}
