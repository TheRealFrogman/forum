import { HttpError } from "@/core/exceptions/HttpError";
import { Session } from "@/core/ports/session/Session";
import { sessionServiceInstance, userServiceInstance } from "@/dependencies";
import { IncomingMessage } from "http";

export async function getSessionUser(request: IncomingMessage) {
   const sessionId = Session.getIdFromCookie(request);
   const session = await sessionServiceInstance.getSessionBySessionId(sessionId)

   if (!session)
      throw new HttpError(401, "Invalid session")

   const user = await userServiceInstance.findOneById(session?.userId);
   if (!user)
      throw new HttpError(401, "Invalid session")
   return user;
}