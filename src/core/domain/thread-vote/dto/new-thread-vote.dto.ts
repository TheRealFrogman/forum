import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { User } from "@/core/domain/user/entities/user.entity";

export class NewThreadVoteDto {
   constructor(
      public thread_id: Thread['id'],
      public user_id: User['id'],
      public vote_type: 'upvote' | 'downvote',
   ) { }

   static schema = {
      title: "NewThreadVoteDto",
      type: "object",
      properties: {
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
      required: ["thread_id", "user_id", "vote_type"],
      additionalProperties: false
   }
}
