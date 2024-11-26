import { User } from "../../../domain/user/entities/user.entity";

export class AccessTokenPayload {
   constructor(
      public readonly userId: User['id'],
   ) { }
   static isValid(payload: any): payload is AccessTokenPayload {
      return payload && typeof payload.userId === 'string';
   }
}