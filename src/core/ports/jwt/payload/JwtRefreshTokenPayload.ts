import { UUID } from "crypto";

export class JwtRefreshTokenPayload {
   constructor(
      public readonly id: UUID
   ) { }
}