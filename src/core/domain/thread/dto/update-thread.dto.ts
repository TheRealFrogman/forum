import { Category } from "@/core/domain/category/entities/category.entity";

export class UpdateThreadDto {
   constructor(
      public description?: string,
      public title?: string,
      public category_id?: Category['id']
   ) { }

   static schema = {
      title: "CreateThreadDto",
      type: "object",
      properties: {
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
         category_id: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
      },
      "anyOf": [
         { "required": ["description"] },
         { "required": ["title"] },
         { "required": ["category_id"] },
      ],
      additionalProperties: false
   }
}
