import { Category } from "@/core/domain/category/entities/category.entity";
import { User } from "@/core/domain/user/entities/user.entity";

interface ThreadProps {
   id: string;
   author_id: User['id'];
   description: string;
   title: string;
   category_id: Category['id'];
   rating: number;
   created_at: Date;

}

interface ThreadInitializer extends ThreadProps { }

export class Thread implements ThreadProps {
   id!: string;
   author_id!: string;
   description!: string;
   title!: string;
   category_id!: string;
   rating!: number;
   created_at!: Date;
   constructor(data: ThreadInitializer) {
      if (data) {
         this.author_id = data.author_id;
         this.id = data.id;
         this.description = data.description;
         this.title = data.title
         this.category_id = data.category_id;
         this.rating = data.rating;
         this.created_at = data.created_at
      }
   }

   static schema = {
      title: "Thread",
      type: "object",
      properties: {
         id: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
         author_id: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
         description: {
            type: "string",
            minLength: 4,
            maxLength: 255
         },
         title: {
            type: "string",
            minLength: 20,
            maxLength: 2000
         },
         category_id: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
         rating: {
            type: "number",
         },
         created_at: {
            type: "string",
            format: "date-time"
         }
      },
      required: ["author_id", "description", "title", "category_id", "id", "rating", "created_at"],
      additionalProperties: false
   }
}
