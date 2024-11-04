export class CreatePhotoDto {
   constructor(
      public link: string,
      public target_type: 'thread' | 'comment',
      public target_id: string,
   ) { }

   static schema = {
      title: "CreatePhotoDto",
      type: "object",
      properties: {
         link: {
            type: "string",
            minLength: 4,
            maxLength: 255
         },
         target_type: {
            type: "string",
            enum: ['thread', 'comment']
         },
         target_id: {
            type: "string",
            minimum: 0
         }
      },
      required: ["link", "target_type", "target_id"],
      additionalProperties: false
   }
}
