interface CommentProps {
   id: number;
   content: string;
   thread_id: number;
   author_id: number;
   rating: number;
}

interface CommentInitializer extends CommentProps { }

export class Comment implements CommentProps {
   id!: number;
   content!: string;
   thread_id!: number;
   author_id!: number;
   rating!: number;

   constructor(data: CommentInitializer) {
      Object.assign(this, data);
   }
}
