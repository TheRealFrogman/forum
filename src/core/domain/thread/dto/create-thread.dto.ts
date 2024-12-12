import { Category } from "@/core/domain/category/entities/category.entity";

export class CreateThreadDto {
   constructor(
      public initial_comment: string,
      public title: string,
      public category_id: Category['id']
   ) { }

   static schema = {
      title: "CreateThreadDto",
      type: "object",
      properties: {
         initial_comment: {
            type: "string",
            minLength: 4,
            maxLength: 255
         },
         title: {
            type: "string",
            minLength: 4,
            maxLength: 255
         },
         category_id: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
      },
      required: ["initial_comment", "title", "category_id"],
      additionalProperties: false
   }
}
