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
      if(data){
         this.id = data.id;
         this.content = data.content;
         this.thread_id = data.thread_id;
         this.author_id = data.author_id;
         this.rating = data.rating
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
         },
         thread_id: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
         author_id: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
         rating: {
            type: "number",
         }
      },
      required: ["id", "content", "thread_id", "author_id", "rating"],
      additionalProperties: false
   }
}
