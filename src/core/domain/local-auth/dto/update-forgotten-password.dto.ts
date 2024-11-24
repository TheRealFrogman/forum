export class UpdateForgottenPasswordDto {
   constructor(
      public readonly password: string
   ) { }

   static schema = {
      "title": "UpdateForgottenPasswordDto",
      "type": "object",
      "properties": {
         "password": {
            "description": "input password",
            "type": "string",
            "minLength": 8,
            "maxLength": 64
         },
      },
      "required": ["password",],
      "additionalProperties": false
   }
}