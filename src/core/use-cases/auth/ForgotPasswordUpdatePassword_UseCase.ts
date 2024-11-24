import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "../UseCase";
import { User } from "@/core/domain/user/entities/user.entity";
import { inject } from "inversify";
import { UserService } from "@/core/domain/user/service/user.service";

export class ForgotPasswordUpdatePassword_UseCase extends UseCase {
   constructor(
      @inject(UserService) private readonly userService: UserService,
   ) {
      super();
   }

   override async execute(user: User, password: string): Promise<EndpointResult> {
      const updatedUser = await this.userService.update(user.id, { password })
      if (!updatedUser)
         return { statusCode: 400, statusMessage: "User not found" }

      return { statusCode: 200, statusMessage: "Password updated" }
   }
}