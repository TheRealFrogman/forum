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
}
