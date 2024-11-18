import { User } from "@/core/domain/user/entities/user.entity";
import { Session } from "@/core/ports/session/Session";
import { sessionServiceInstance, userServiceInstance } from "@/inversify.config";
import { IncomingMessage } from "http";


/**
 * @description
 * Finds the user associated with the session id in the request cookie.
 * If no session id is present, or if the session id is not associated with
 * a user, this function returns null.
 * @param { IncomingMessage } request - The request to check for a session id.
 * @returns { User | null } The user associated with the session id, or null
 * if no user is found.
 */
export async function getSessionUser(request: IncomingMessage): Promise<User | null> {
   const sessionId = Session.getIdFromCookie(request);
   if (!sessionId)
      return null;
   const session = await sessionServiceInstance.getSession(sessionId)
   if (!session)
      return null;

   const user = await userServiceInstance.findOneById(session?.userId);
   if (!user)
      return null;
   return user;
}