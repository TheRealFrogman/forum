interface UserProps {
   id: number;
   username: string;
   hashed_password: string;
}

interface UserInitializer {
   id: number;
   username: string;
   hashed_password: string;
}

export class User implements UserProps {
   id!: number;
   username!: string;
   hashed_password!: string;
   constructor(data: UserInitializer) {
      Object.assign(this, data);
   }

   // strip the password
   toJSON() {
      return {
         id: this.id,
         username: this.username,
      }
   }

   static schema = {
      "title": "User",
      "description": "User entity",
      "type": "object",
      "properties": {
         "id": {
            "type": "number",
            "minimum": 0
         },
         "username": {
            "type": "string",
            "minLength": 3,
            "maxLength": 30
         },
         "hashed_password": {
            "description": "hashed password, salt + hash",
            "type": "string",
            "pattern": ".+:.+",
            "minLength": 64,
         }
      },
      "required": ["id", "username", "hashed_password"],
      "additionalProperties": false
   }
}
