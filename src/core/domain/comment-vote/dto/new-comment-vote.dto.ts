

export class NewCommentVoteDto {
   constructor(
      public comment_id: string,
      public user_id: string,
      public vote_type: 'upvote' | 'downvote',
   ) { }

   static schema = {
      title: "NewCommentVoteDto",
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
