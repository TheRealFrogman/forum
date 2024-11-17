import { User } from "@/core/domain/user/entities/user.entity";
import { Session } from "./Session";

export interface ISessionRepository {
   getSessionBySessionId(sessionId: Session['session_id']): Promise<Session | null>;
   getAllSessionsByUserId(userId: User['id']): Promise<Session[]>;
   createSession(session: Session): Promise<Session>;
   updateSession(session: Session): Promise<void>;
   deleteSession(sessionId: Session['session_id']): Promise<void>;
}