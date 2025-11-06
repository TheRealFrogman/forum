import { User } from "@/core/domain/user/entities/user.entity";
import { UserService } from "@/core/domain/user/service/user.service";
import { IEmailer } from "@/core/ports/emailer/IEmailer";
import { ForgotPasswordJwtService } from "@/core/ports/jwt/service/ForgotPasswordJwtService";
import { EndpointResult } from "@/core/routing/reused-code/routes";
import { UseCase } from "@/core/use-cases/UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class ForgotPasswordSendEmail_UseCase extends UseCase {
   constructor(
      @inject(UserService) private readonly userService: UserService,
      @inject(IEmailer) private readonly emailer: IEmailer,
      @inject(ForgotPasswordJwtService) private readonly forgotPasswordJwtService: ForgotPasswordJwtService
   ) {
      super();
   }
   override async execute(userEmail: string): Promise<EndpointResult> {
      const userByEmail = await this.userService.findUserByEmail(userEmail);
      if (!userByEmail)
         return { statusCode: 404, statusMessage: "User by this email not found" };

      const sent = await this.emailer.sendEmail(process.env["APP_EMAIL"]!, userEmail, "Password reset", `Click this link to reset your password: ${this.createLink(userByEmail)}`);
      if (!sent)
         return { statusCode: 500, statusMessage: "Email sending failed" };

      return { statusCode: 200, statusMessage: "Password reset email sent" };
   }

   private async createLink(user: User) {
      return `http://${process.env["HOSTNAME"]}/auth/forgot-password?token=${await this.forgotPasswordJwtService.sign({ userId: user.id })}`
   }
}