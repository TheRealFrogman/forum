
export class RegisterDto {
   constructor(
      public username: string,
      public password: string
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
         }
      },
      "required": ["username", "password"],
      "additionalProperties": false
   }
}
