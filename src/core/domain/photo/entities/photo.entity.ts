
interface PhotoProps {
   id: string;
   link: string;
   target_type: 'thread' | 'comment';
   target_id: number;
}

interface PhotoInitializer extends PhotoProps { }

export class Photo implements PhotoProps {
   id!: string;
   link!: string;
   target_type!: 'thread' | 'comment';
   target_id!: number;

   constructor(data: PhotoInitializer) {
      Object.assign(this, data);
   }
}