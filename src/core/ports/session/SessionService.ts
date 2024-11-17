import { randomUUID } from "crypto";
import { Session } from "./Session";
import { ISessionRepository } from "./SessionRepository";
import { User } from "@/core/domain/user/entities/user.entity";

// its ok to return objects by reference not by value because they're frozen and immutable
export class SessionService {
   constructor(
      private readonly sessions: ISessionRepository,
   ) { }

   async createSessionForUser(user: User) {
      return this.sessions.createSession(new Session(randomUUID(), user.id))
   }

   async updateSession(session: Session) {
      return this.sessions.updateSession(session)
   }

   async destroySession(session: Session): Promise<void> {
      return this.sessions.deleteSession(session.sessionId)
   }

   async getSessionBySessionId(session_id: Session['sessionId']): Promise<Session | null> {
      return this.sessions.getSessionBySessionId(session_id)
   }
   async getAllSessionsForUser(user_id: User['id']): Promise<Session[]> {
      return this.sessions.getAllSessionsByUserId(user_id)
   }
}