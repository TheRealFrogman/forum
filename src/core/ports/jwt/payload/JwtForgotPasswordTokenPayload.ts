import { User } from "@/core/domain/user/entities/user.entity";

export class JwtForgotPasswordTokenPayload {
   constructor(
      public readonly userId: User['id'],
   ) {}
   static isValid(payload: any): payload is JwtForgotPasswordTokenPayload {
      return payload && typeof payload.userId === 'string';
   }
}