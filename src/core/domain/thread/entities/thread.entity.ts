
interface ThreadProps {
   id: string;
   author_id: string;
   description: string;
   title: string;
   category_id: string;
   rating: number;
}

interface ThreadInitializer extends ThreadProps { }

export class Thread implements ThreadProps {
   id!: string;
   author_id!: string;
   description!: string;
   title!: string;
   category_id!: string;
   rating!: number;
   constructor(data: ThreadInitializer) {
      if (data) {
         this.author_id = data.author_id;
         this.id = data.id;
         this.description = data.description;
         this.title = data.title
         this.category_id = data.category_id;
         this.rating = data.rating;
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
         },
         categiry_id: {
            type: "string",
            minLength: 0,
            "pattern": "[0-9]+"
         },
         rating: {
            type: "number",
         }
      },
      required: ["author_id", "description", "title", "category_id", "id", "rating"],
      additionalProperties: false
   }
}
