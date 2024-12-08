import { Comment } from "@/core/domain/comment/entities/comment.entity";
import { User } from "@/core/domain/user/entities/user.entity";

interface VoteProps {
   comment_id: Comment['id'];
   user_id: User['id'];
   vote_type: 'upvote' | 'downvote';
   created_at: Date;
}

interface CategoryInitializer extends VoteProps { }

export class Vote implements VoteProps {
   comment_id!: Comment['id']
   user_id!: User['id']
   vote_type!: 'upvote' | 'downvote'
   created_at!: Date;

   constructor(data: CategoryInitializer) {
      if (data) {
         this.comment_id = data.comment_id;
         this.user_id = data.user_id;
         this.vote_type = data.vote_type
         this.created_at = data.created_at
      }
   }

   static schema = {
      title: "CommentVote",
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
         },
         created_at: {
            type: "string",
            format: "date-time"
         }
      },
      required: ["comment_id", "user_id", "vote_type", "created_at"],
      additionalProperties: false
   }
}
