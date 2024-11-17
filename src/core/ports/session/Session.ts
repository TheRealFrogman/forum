import { User } from "@/core/domain/user/entities/user.entity";
import { parseCookies } from "@/core/lib/parseCookies";
import { UUID } from "node:crypto";
import { IncomingMessage } from "node:http";

export class Session {
   constructor(
      public readonly sessionId: UUID,
      public readonly userId: User['id']
   ) {
      Object.freeze(this);
   }
   static getIdFromCookie(request: IncomingMessage): UUID | null {
      const { session: sessionId } = parseCookies(request);
      if (!sessionId) {
         return null;
      }

      return sessionId as UUID;
   }

   toString() {
      return JSON.stringify(this);
   }
}