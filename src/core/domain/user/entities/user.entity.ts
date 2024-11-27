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
   email: string;
   email_confirmed: boolean
}

interface UserInitializer {
   id: string;
   username: string;
   hashed_password: string;
   role: Role;
   created_at: Date;
   email: string;
   email_confirmed: boolean
}

export class User implements UserProps {
   email!: string
   id!: string;
   username!: string;
   hashed_password!: string;
   role!: Role
   created_at!: Date;
   email_confirmed!: boolean
   constructor(data: UserInitializer) {
      if (data) {
         this.id = data.id;
         this.username = data.username;
         this.hashed_password = data.hashed_password;
         this.role = data.role;
         this.created_at = data.created_at;
         this.email = data.email
         this.email_confirmed = data.email_confirmed
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
            "pattern": "^[0-9]+$"
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
         "email": {
            "type": "string",
            "pattern": "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
         }
      },
      "required": ["id", "username", "hashed_password", "email"],
      "additionalProperties": false
   }
}
