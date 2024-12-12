import { Comment } from "@/core/domain/comment/entities/comment.entity";

export class NewVoteDto {
   constructor(
      public comment_id: Comment['id'],
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
         vote_type: {
            enum: ['upvote', 'downvote']
         }
      },
      required: ["comment_id", "vote_type"],
      additionalProperties: false
   }
}
