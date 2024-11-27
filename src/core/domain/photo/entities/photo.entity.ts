import { Comment } from "@/core/domain/comment/entities/comment.entity";
import { Thread } from "@/core/domain/thread/entities/thread.entity";

interface PhotoProps {
   id: string;
   link: string;
   target_type: 'thread' | 'comment';
   target_id: Thread['id'] | Comment['id'];
}

interface PhotoInitializer extends PhotoProps { }

export class Photo implements PhotoProps {
   id!: string;
   link!: string;
   target_type!: 'thread' | 'comment';
   target_id!: Thread['id'] | Comment['id'];

   constructor(data: PhotoInitializer) {
      if (data) {
         this.id = data.id;
         this.link = data.link;
         this.target_type = data.target_type;
         this.target_id = data.target_id;
      }
   }

   static schema = {
      title: "Photo",
      type: "object",
      properties: {
         id: {
            type: "string",
            "pattern": "^[0-9]+$"
         },
         link: {
            type: "string",
            minLength: 4,
            maxLength: 255,
         },
         target_type: {
            type: "string",
            enum: ['thread', 'comment'],
         },
         target_id: {
            type: "string",
            minimum: 0,
         }
      },
      required: ["link", "target_type", "target_id"],
      additionalProperties: false
   }
}