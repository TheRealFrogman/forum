export enum Role {
   REGULAR = 'regular',
   ADMIN = 'admin',
}

interface UserProps {
   id: string;
   username: string;
   hashed_password: string;
   role: Role;
   created_at: Date;
}

interface UserInitializer {
   id: string;
   username: string;
   hashed_password: string;
   role: Role;
   created_at: Date;
}

export class User implements UserProps {
   id!: string;
   username!: string;
   hashed_password!: string;
   role!: Role
   created_at!: Date;
   constructor(data: UserInitializer) {
      if (data) {
         this.id = data.id;
         this.username = data.username;
         this.hashed_password = data.hashed_password;
         this.role = data.role;
         this.created_at = data.created_at;
      }
   }

   toJSON() {
      return {
         id: this.id,
         username: this.username,
         role: this.role,
         created_at: this.created_at
      }
   }

   static schema = {
      "title": "User",
      "description": "User entity",
      "type": "object",
      "properties": {
         "id": {
            "type": "string",
            "minLength": 0,
            "pattern": "[0-9]+"
         },
         "username": {
            "type": "string",
            "minLength": 3,
            "maxLength": 30,
            "pattern": "[a-zA-Z0-9]+"
         },
         "hashed_password": {
            "description": "hashed password, salt + hash",
            "type": "string",
            "pattern": ".+:.+",
            "minLength": 64,
         },
         "role": {
            "type": "string",
            "enum": ["regular", "admin"]
         },
      },
      "required": ["id", "username", "hashed_password"],
      "additionalProperties": false
   }
}
