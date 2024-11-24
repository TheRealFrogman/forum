
export class RegisterDto {
   constructor(
      public username: string,
      public password: string,
      public email: string
   ) { }

   static schema = {
      "title": "RegisterDto",
      "type": "object",
      "properties": {
         "username": {
            "type": "string",
            "minLength": 3,
            "maxLength": 30,
            "pattern": "[a-zA-Z0-9]+"
         },
         "password": {
            "description": "input password",
            "type": "string",
            "minLength": 8,
            "maxLength": 64
         },
         "email": {
            "type": "string",
            "pattern": "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
         }
      },
      "required": ["username", "password", "email"],
      "additionalProperties": false
   }
}
