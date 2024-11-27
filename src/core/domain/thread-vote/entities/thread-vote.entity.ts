import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { User } from "@/core/domain/user/entities/user.entity";

interface ThreadProps {
   id: string;
   thread_id: Thread['id'];
   user_id: User['id'];
   vote_type: 'upvote' | 'downvote';
}

interface ThreadInitializer extends ThreadProps { }

export class ThreadVote implements ThreadProps {
   id!: string
   thread_id!: string
   user_id!: string
   vote_type!: 'upvote' | 'downvote'
   constructor(data: ThreadInitializer) {
      if (data) {
         this.id = data.id;
         this.thread_id = data.thread_id;
         this.user_id = data.user_id;
         this.vote_type = data.vote_type
      }
   }

   static schema = {
      title: "ThreadVote",
      type: "object",
      properties: {
         id: {
            type: "string",
            minLength: 1,
            "pattern": "^[0-9]+$"
         },
         thread_id: {
            type: "string",
            minLength: 1,
            "pattern": "^[0-9]+$"
         },
         user_id: {
            type: "string",
            minLength: 1,
            "pattern": "^[0-9]+$"
         },
         vote_type: {
            enum: ['upvote', 'downvote']
         }
      },
      required: ["id", "thread_id", "user_id", "vote_type"],
      additionalProperties: false
   }
}
