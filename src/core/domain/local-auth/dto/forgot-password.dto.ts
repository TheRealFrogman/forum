export class ForgotPasswordDto {
   constructor(
      public email: string,
   ) { }

   static schema = {
      "title": "ForgotPasswordDto",
      "type": "object",
      "properties": {
         "email": {
            "type": "string",
            "pattern": "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
         }
      },
      "required": ["email",],
      "additionalProperties": false
   }
}