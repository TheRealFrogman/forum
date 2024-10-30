
export class UpdateUserDto {
   username?: string;
   password?: string;
   constructor(data: UpdateUserDto) {
      Object.assign(this, data);
   }

   static schema = {
      "title": "UpdateUserDto",
      "type": "object",
      "description": "at least one required",
      "properties": {
         "username": {
            "type": "string",
            "minLength": 3,
            "maxLength": 30
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