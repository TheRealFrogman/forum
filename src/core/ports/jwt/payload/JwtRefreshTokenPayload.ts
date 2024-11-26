import { UUID } from "crypto";

export class JwtRefreshTokenPayload {
   constructor(
      public readonly id: UUID
   ) { }
   static isValid(payload: any): payload is JwtRefreshTokenPayload {
      return (
         payload &&
         typeof payload.id === 'string' &&
         /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(payload.id)
      );
   }
}