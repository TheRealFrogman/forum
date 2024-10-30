
interface PhotoProps {
   id: number;
   link: string;
   target_type: 'thread' | 'comment';
   target_id: number;
}

interface PhotoInitializer extends PhotoProps { }

export class Photo implements PhotoProps {
   id!: number;
   link!: string;
   target_type!: 'thread' | 'comment';
   target_id!: number;

   constructor(data: PhotoInitializer) {
      Object.assign(this, data);
   }
}