import { Category } from "@/core/domain/category/entities/category.entity";
import { User } from "@/core/domain/user/entities/user.entity";

export class CreateThreadDto {
   constructor(
      public author_id: User['id'],
      public initial_comment: string,
      public title: string,
      public category_id: Category['id']
   ) { }

   static schema = {
      title: "CreateThreadDto",
      type: "object",
      properties: {
         author_id: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
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
      required: ["author_id", "initial_comment", "title", "category_id"],
      additionalProperties: false
   }
}
