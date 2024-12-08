import { Comment } from "@/core/domain/comment/entities/comment.entity";
import { User } from "@/core/domain/user/entities/user.entity";

export class NewVoteDto {
   constructor(
      public comment_id: Comment['id'],
      public user_id: User['id'],
      public vote_type: 'upvote' | 'downvote',
   ) { }

   static schema = {
      title: "NewVoteDto",
      type: "object",
      properties: {
         comment_id: {
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
      required: ["comment_id", "user_id", "vote_type"],
      additionalProperties: false
   }
}
