import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "../UseCase";
import { inject, injectable } from "inversify";
import { RegisterDto } from "@/core/domain/local-auth/dto/register.dto";
import { LocalAuthenticatorService } from "@/core/domain/local-auth/local-auth";
import { User } from "@/core/domain/user/entities/user.entity";
import { ConfirmEmailJwtService } from "@/core/ports/jwt/service/ConfirmEmailJwtService";
import { IEmailer } from "@/core/ports/emailer/IEmailer";

@injectable()
export class Register_UseCase extends UseCase {
   constructor(
      @inject(LocalAuthenticatorService) private readonly localAuthenticator: LocalAuthenticatorService,
      @inject(ConfirmEmailJwtService) private readonly confrirmEmailJwtService: ConfirmEmailJwtService,
      @inject(IEmailer) private readonly emailer: IEmailer,
   ) {
      super();
   }

   override async execute(registerDto: RegisterDto): Promise<EndpointResult> {
      const user = await this.localAuthenticator.register(registerDto);
      if (!user)
         return { statusCode: 409, statusMessage: "User already exists" };



      const sent = await this.emailer.sendEmail(process.env["APP_EMAIL"]!, user.email, "Email confirmation", `Click this link to confirm your email: ${this.createLink(user)}`);
      if (!sent)
         return { statusCode: 500, statusMessage: "Email sending failed" };

      return { statusCode: 201, responseModel: user, statusMessage: "User created" }
   }
   private async createLink(user: User) {
      return `http://localhost:3000/auth/forgot-password?token=${await this.confrirmEmailJwtService.sign({ userId: user.id })}`
   }
}