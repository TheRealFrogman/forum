
interface ThreadProps {
   id: string;
   author_id: string;
   description: string;
   title: string;
}

interface ThreadInitializer extends ThreadProps { }

export class Thread implements ThreadProps {
   id!: string;
   author_id!: string;
   description!: string;
   title!: string;
   constructor(data: ThreadInitializer) {
      Object.assign(this, data);
   }
}
