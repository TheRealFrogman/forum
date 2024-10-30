
export class CreateUserDto {
   username!: string
   password!: string

   constructor(data: CreateUserDto) {
      Object.assign(this, data);
   }

   static schema = {
      "title": "CreateUserDto",
      "type": "object",
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
      "required": ["username", "password"],
      "additionalProperties": false
   }
}
