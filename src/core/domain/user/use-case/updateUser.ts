import { UpdateUserDto } from "@/core/domain/user/dto/update-user.dto";
import { Role, User } from "@/core/domain/user/entities/user.entity";

import { userServiceInstance } from "@/dependencies";
import { EndpointResult } from "@/routing/routes";

export async function updateUser_UseCase(user: User, updateId: User['id'], payload: UpdateUserDto): Promise<EndpointResult> {
   const updateCandidate = await userServiceInstance.findOneById(updateId);
   if (!updateCandidate)
      return { statusCode: 400, statusMessage: "Update candidate not found" };

   if (canUpdateUser(user, updateCandidate)) {
      return { statusCode: 200, responseModel: await userServiceInstance.update(updateId, payload) };
   }

   return { statusCode: 401, statusMessage: "You are not allowed to update this user" };
}

function canUpdateUser(actor: User, target: User) {
   if (actor.role === Role.ADMIN)
      return true;
   if (actor.id === target.id)
      return true;
   return false;
}