import { Category } from "@/core/domain/category/entities/category.entity";
import { User } from "@/core/domain/user/entities/user.entity";

interface ThreadProps {
   id: string;
   author_id: User['id'];
   title: string;
   category_id: Category['id'];
   created_at: Date;
   comment_count: number;
   last_commented_at: Date
   views_count: number;
}

interface ThreadInitializer extends ThreadProps { }

export class Thread implements ThreadProps {
   id!: string;
   author_id!: string;
   title!: string;
   category_id!: string;
   created_at!: Date;
   comment_count!: number;
   last_commented_at!: Date
   views_count!: number
   constructor(data: ThreadInitializer) {
      if (data) {
         this.author_id = data.author_id;
         this.id = data.id;
         this.title = data.title
         this.category_id = data.category_id;
         this.created_at = data.created_at
         this.comment_count = data.comment_count
         this.last_commented_at = data.last_commented_at
         this.views_count = data.views_count
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
         title: {
            type: "string",
            minLength: 20,
            maxLength: 2000
         },
         category_id: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
         created_at: {
            type: "string",
            format: "date-time"
         },
         comment_count: {
            type: "string",
            pattern: "^[0-9]+$"
         },
         last_commented_at: {
            type: "string",
            format: "date-time"
         },
         views_count: {
            type: "string",
            pattern: "^[0-9]+$"
         }
      },
      required: ["author_id", "title", "category_id", "id", "rating", "created_at", "comment_count", "last_commented_at", "views_count"],
      additionalProperties: false
   }
}
