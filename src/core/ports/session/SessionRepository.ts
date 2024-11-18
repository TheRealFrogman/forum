import { User } from "@/core/domain/user/entities/user.entity";
import { Session } from "./Session";

export abstract class ISessionRepository {
   abstract getSessionBySessionId(sessionId: Session['sessionId']): Promise<Session | null>;
   abstract getAllSessionsByUserId(userId: User['id']): Promise<Session[]>;
   abstract createSession(session: Session): Promise<Session>;
   abstract updateSession(session: Session): Promise<void>;
   abstract deleteSession(sessionId: Session['sessionId']): Promise<void>;
}