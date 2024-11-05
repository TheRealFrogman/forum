import { Thread } from "../../thread/entities/thread.entity";

enum Role {
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
      Object.assign(this, data);
   }

   canUpdate(user: User) {
      if (this.role === Role.ADMIN) { return true; }
      if (this.id === user.id) { return true; }
      return false;
   }

   canDelete(user: User) {
      if (this.role === Role.ADMIN) { return true; }
      if (this.id === user.id) { return true; }
      return false;
   }
   canCreateThread() {
      return true;
   }
   canCommentOnThread(thread: Thread) {
      return true;
   }

   // strip the password 
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
            "minLength": 0
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
         }
      },
      "required": ["id", "username", "hashed_password"],
      "additionalProperties": false
   }
}
