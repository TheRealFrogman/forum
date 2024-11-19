import { UpdateUserDto } from "@/core/domain/user/dto/update-user.dto";
import { Role, User } from "@/core/domain/user/entities/user.entity";

import { EndpointResult } from "@/core/routing/routes";
import { UserService } from "@/core/domain/user/service/user.service";
import { inject, injectable } from "inversify";

import { UseCase } from "@/core/domain/use-cases/UseCase";
@injectable()
export class UpdateUser_UseCase extends UseCase {
   constructor(
      @inject(UserService) private readonly userService: UserService,
   ) {
      super();
   }

   async execute(user: User, updateId: User['id'], payload: UpdateUserDto): Promise<EndpointResult> {
      const updateCandidate = await this.userService.findOneById(updateId);
      if (!updateCandidate)
         return { statusCode: 400, statusMessage: "Update candidate not found" };

      if (this.canDo(user, updateCandidate)) {
         return { statusCode: 200, responseModel: await this.userService.update(updateId, payload) };
      }

      return { statusCode: 401, statusMessage: "You are not allowed to update this user" };
   }
   override canDo(actor: User, target: User) {
      if (actor.role === Role.ADMIN)
         return true;
      if (actor.id === target.id)
         return true;
      return false;
   }
}