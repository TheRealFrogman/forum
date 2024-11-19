import { User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/routes";

import { UserService } from "@/core/domain/user/service/user.service";
import { UseCase } from "@/core/domain/use-cases/UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class GetUser_UseCase extends UseCase {
   constructor(
      @inject(UserService) private readonly userService: UserService,
   ) {
      super();
   }
   async execute(username?: string, id?: User['id']): Promise<EndpointResult> {
      if (id && !username)
         return { statusCode: 200, responseModel: await this.userService.findOneById(id) }

      if (username && !id)
         return { statusCode: 200, responseModel: await this.userService.findUserByUsername(username) }

      return { statusCode: 400, statusMessage: "No id or username provided" };
   }
}
