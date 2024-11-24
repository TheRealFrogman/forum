
interface PhotoProps {
   id: string;
   link: string;
   target_type: 'thread' | 'comment';
   target_id: string;
}

interface PhotoInitializer extends PhotoProps { }

export class Photo implements PhotoProps {
   id: string;
   link: string;
   target_type: 'thread' | 'comment';
   target_id: string;

   constructor(data: PhotoInitializer) {
      this.id = data.id;
      this.link = data.link;
      this.target_type = data.target_type;
      this.target_id = data.target_id;
   }

   static schema = {
      title: "Photo",
      type: "object",
      properties: {
         id: {
            type: "string",
            minLength: 0,
            "pattern": "[0-9]+"
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