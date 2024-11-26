import { User } from "@/core/domain/user/entities/user.entity";

export class JwtConfirmEmailPayload {
   constructor(
      public readonly userId: User['id'],
   ) {}
   static isValid(payload: any): payload is JwtConfirmEmailPayload {
      return payload && typeof payload.userId === 'string';
   }
}