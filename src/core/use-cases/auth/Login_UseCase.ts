import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "../UseCase";
import { LoginDto } from "@/core/domain/local-auth/dto/login.dto";
import { inject, injectable } from "inversify";
import { LocalAuthenticatorService } from "@/core/domain/local-auth/local-auth";
import { SessionService } from "@/core/ports/session/SessionService";
import { cookie } from "@/core/lib/setCookie";


@injectable()
export class Login_UseCase extends UseCase {
   constructor(
      @inject(LocalAuthenticatorService) private readonly localAuthenticator: LocalAuthenticatorService,
      @inject(SessionService) private readonly sessionService: SessionService
   ) {
      super();
   }
   override async execute(loginDto: LoginDto): Promise<EndpointResult> {
      const user = await this.localAuthenticator.authenticate(loginDto);
      if (!user)
         return { statusCode: 401, statusMessage: "Invalid credentials" };

      const session = await this.sessionService.createSessionForUser(user);
      return {
         statusCode: 200,
         headers: {
            'set-cookie': cookie('session', session.sessionId, new Date(Date.now() + 1000 * 60 * 5), { domain: process.env['DOMAIN'] ?? "localhost", httpOnly: true, secure: true, sameSite: "Strict", maxAge: 31536000, path: "/" }),
         },
      }
   }
}