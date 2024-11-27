interface CategoryProps {
   id: string;
   comment_id: string;
   user_id: string;
   vote_type: 'upvote' | 'downvote';
}

interface CategoryInitializer extends CategoryProps { }

export class CommentVote implements CategoryProps {
   id!: string
   comment_id!: string
   user_id!: string
   vote_type!: 'upvote' | 'downvote'
   constructor(data: CategoryInitializer) {
      if (data) {
         this.id = data.id;
         this.comment_id = data.comment_id;
         this.user_id = data.user_id;
         this.vote_type = data.vote_type
      }
   }

   static schema = {
      title: "CommentVote",
      type: "object",
      properties: {
         id: {
            type: "string",
            minLength: 1,
            "pattern": "^[0-9]+$"
         },
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
      required: ["id", "comment_id", "user_id", "vote_type"],
      additionalProperties: false
   }
}
