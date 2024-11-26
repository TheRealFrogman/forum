
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
      if(data) {
         this.author_id = data.author_id;
         this.id = data.id;
         this.description = data.description;
         this.title = data.title
      }
   }

   static schema = {
      title: "Thread",
      type: "object",
      properties: {
         id: {
            type: "string",
            minLength: 0,
            "pattern": "[0-9]+"
         },
         author_id: {
            type: "string",
            minLength: 0,
            "pattern": "[0-9]+"
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
