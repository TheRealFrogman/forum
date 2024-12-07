import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "../UseCase";
import { inject, injectable } from "inversify";
import { RegisterDto } from "@/core/domain/local-auth/dto/register.dto";
import { LocalAuthenticatorService } from "@/core/domain/local-auth/local-auth";

@injectable()
export class Register_UseCase extends UseCase {
   constructor(
      @inject(LocalAuthenticatorService) private readonly localAuthenticator: LocalAuthenticatorService,
   ) {
      super();
   }

   override async execute(registerDto: RegisterDto): Promise<EndpointResult> {
      const user = await this.localAuthenticator.register(registerDto);
      if (!user)
         return { statusCode: 409, statusMessage: "User already exists" };

      const sent = this.localAuthenticator.sendConfirmationEmail(user);
      if (!sent)
         return { statusCode: 500, statusMessage: "Email sending failed" };

      return { statusCode: 201, responseModel: user, statusMessage: "User created" }
   }
}