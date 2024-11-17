import { User } from "@/core/domain/user/entities/user.entity";
import { Session } from "@/core/ports/session/Session";
import { ISessionRepository } from "@/core/ports/session/SessionRepository";

export class SessionMAPRepository implements ISessionRepository {
   private static sessionStore = new Map<Session['sessionId'], Session>()

   async getAllSessionsByUserId(userId: User["id"]): Promise<Session[]> {
      const sessions = Array.from(SessionMAPRepository.sessionStore.values());
      return sessions.filter(session => session.user_id === userId);
   }
   async getSessionByUserId(userId: User['id']): Promise<Session | null> {
      return Array.from(SessionMAPRepository.sessionStore.values()).find(session => session.user_id === userId) ?? null;
   }

   async getSessionBySessionId(sessionId: Session['sessionId']): Promise<Session | null> {
      return SessionMAPRepository.sessionStore.get(sessionId) ?? null;
   }

   async createSession(session: Session): Promise<Session> {
      SessionMAPRepository.sessionStore.set(session.sessionId, session);
      return session;
   }

   async updateSession(session: Session): Promise<void> {
      SessionMAPRepository.sessionStore.set(session.sessionId, session);
   }

   async deleteSession(sessionId: Session['sessionId']): Promise<void> {
      SessionMAPRepository.sessionStore.delete(sessionId);
   }

}