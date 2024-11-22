import { Role, User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/routes";

import { UserService } from "@/core/domain/user/service/user.service";
import { UseCase } from "@/core/use-cases/UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class DeleteUser_UseCase extends UseCase<UserDeletedEvent> {
   constructor(
      @inject(UserService) private readonly userService: UserService,
   ) {
      super();
   }
   override async execute(user: User, deleteId: User['id']): Promise<EndpointResult> {
      const deleteCandidate = await this.userService.findOneById(deleteId);
      if (!deleteCandidate)
         return { statusCode: 400, statusMessage: "Delete candidate not found" };

      if (this.canDo(user, deleteCandidate)) {
         const user = await this.userService.delete(deleteCandidate);
         this.publish(new UserDeletedEvent(user!));
         return { statusCode: 204, statusMessage: "User deleted", responseModel: user };
      }

      return { statusCode: 401, statusMessage: "You are not allowed to delete this user" };
   }

   override canDo(actor: User, target: User): boolean {
      if (actor.role === Role.ADMIN)
         return true;
      if (actor.id === target.id)
         return true;

      return false;
   }
}

class UserDeletedEvent {
   public readonly timestamp: Date = new Date();
   constructor(
      public readonly user: User,
   ) { }
}