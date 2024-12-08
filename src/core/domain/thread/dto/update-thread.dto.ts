import { Category } from "@/core/domain/category/entities/category.entity";

export class UpdateThreadDto {
   constructor(
      public title?: string,
      public category_id?: Category['id'],
   ) { }

   static schema = {
      title: "UpdateThreadDto",
      type: "object",
      properties: {
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
      "anyOf": [
         { "required": ["title"] },
         { "required": ["category_id"] },
      ],
      additionalProperties: false
   }
}
