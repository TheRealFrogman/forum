interface CommentProps {
   id: string;
   content: string;
   thread_id: string;
   author_id: string;
   rating: number;
}

interface CommentInitializer extends CommentProps { }

export class Comment implements CommentProps {
   id!: string;
   content!: string;
   thread_id!: string;
   author_id!: string;
   rating!: number;

   constructor(data: CommentInitializer) {
      Object.assign(this, data);
   }

   static schema = {
      title: "Comment",
      type: "object",
      properties: {
         id: {
            type: "string",
            minLength: 0,
            "pattern": "[0-9]+"
         },
         content: {
            type: "string",
         },
         thread_id: {
            type: "string",
            minLength: 0,
            "pattern": "[0-9]+"
         },
         author_id: {
            type: "string",
            minLength: 0,
            "pattern": "[0-9]+"
         },
         rating: {
            type: "number",
         }
      },
      required: ["id", "content", "thread_id", "author_id", "rating"],
      additionalProperties: false
   }
}
