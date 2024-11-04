
export class UpdateUserDto {
   constructor(
      public username?: string,
      public password?: string
   ) { }

   static schema = {
      "title": "UpdateUserDto",
      "type": "object",
      "description": "at least one required",
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
         }
      },
      "anyOf": [
         { "required": ["username"] },
         { "required": ["password"] }
      ],
      "additionalProperties": false
   }
}