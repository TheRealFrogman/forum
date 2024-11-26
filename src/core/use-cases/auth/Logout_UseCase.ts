import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "../UseCase";
import { inject, injectable } from "inversify";
import { SessionService } from "@/core/ports/session/SessionService";
import { Session } from "@/core/ports/session/Session";
import { unsetSessionCookieHeaders } from "@/core/routing/reused-code/headers/unsetSessionCookie.headers";

@injectable()
export class Logout_UseCase extends UseCase {
   constructor(
      @inject(SessionService) private readonly sessionService: SessionService,
   ) {
      super();
   }
   override async execute(sessionId: Session['sessionId']): Promise<EndpointResult> {
      const session = await this.sessionService.getSession(sessionId);


      if (!session)
         return {
            statusCode: 401,
            statusMessage: "Invalid session",
            headers: { ...unsetSessionCookieHeaders },
         }

      await this.sessionService.destroySession(session);
      return {
         statusCode: 200,
         statusMessage: "Session destroyed",
         headers: { ...unsetSessionCookieHeaders },
      };
   }
}
