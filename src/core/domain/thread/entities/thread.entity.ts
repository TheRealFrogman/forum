
interface ThreadProps {
   id: number;
   author_id: number;
   description: string;
   title: string;
}

interface ThreadInitializer extends ThreadProps { }

export class Thread implements ThreadProps {
   id!: number;
   author_id!: number;
   description!: string;
   title!: string;
   constructor(data: ThreadInitializer) {
      Object.assign(this, data);
   }
}
