import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "../UseCase";
import { inject, injectable } from "inversify";
import { UserService } from "@/core/domain/user/service/user.service";
import { User } from "@/core/domain/user/entities/user.entity";
import { LocalAuthenticatorService } from "@/core/domain/local-auth/local-auth";

@injectable()
export class ConfirmEmail_UseCase extends UseCase {
   constructor(
      @inject(UserService) private readonly userService: UserService,
      @inject(LocalAuthenticatorService) private readonly localAuthenticator: LocalAuthenticatorService
   ) {
      super();
   }
   async execute(userId: User['id']): Promise<EndpointResult> {
      const user = await this.userService.findOneById(userId);
      if (!user)
         return { statusCode: 404, statusMessage: "User not found" };

      const updatedUser = await this.localAuthenticator.confirmEmail(user);
      if (!updatedUser)
         return { statusCode: 500, statusMessage: "Email confirmation failed" };

      return { statusCode: 200, statusMessage: "Email confirmed" };
   }
}