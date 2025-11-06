import { User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/reused-code/routes";

import { UserService } from "@/core/domain/user/service/user.service";
import { UseCase } from "@/core/use-cases/UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class GetUser_UseCase extends UseCase<GetUserEvent> {
   constructor(
      @inject(UserService) private readonly userService: UserService,
   ) {
      super();
   }
   async execute(username?: string, id?: User['id']): Promise<EndpointResult> {
      if (id && !username) {
         const result = await this.userService.findOneById(id);
         if (!result) {
            return { statusCode: 404, statusMessage: "User not found" };
         }

         this.publish(new GetUserEvent(result));
         return { statusCode: 200, responseModel: result }
      }

      if (username && !id) {
         const result = await this.userService.findUserByUsername(username);
         if (!result) {
            return { statusCode: 404, statusMessage: "User not found" };
         }

         this.publish(new GetUserEvent(result));
         return { statusCode: 200, responseModel: result }
      }

      return { statusCode: 400, statusMessage: "No id or username provided" };
   }
}

class GetUserEvent {
   public readonly timestamp: Date = new Date();
   constructor(
      public readonly user: User,
   ) { }
}