
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

   static schema = {
      title: "Thread",
      type: "object",
      properties: {
         id: {
            type: "string",
            minLength: 0,
         },
         author_id: {
            type: "string",
            minLength: 0,
         },
         description: {
            type: "string",
            minLength: 4,
            maxLength: 255
         },
         title: {
            type: "string",
            minLength: 4,
            maxLength: 255
         }
      },
      required: ["author_id", "description", "title"],
      additionalProperties: false
   }
}
