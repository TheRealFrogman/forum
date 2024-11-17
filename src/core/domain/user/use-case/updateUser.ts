import { UpdateUserDto } from "@/core/domain/user/dto/update-user.dto";
import { Role, User } from "@/core/domain/user/entities/user.entity";
import { HttpError } from "@/core/exceptions/HttpError";

import { userServiceInstance } from "@/dependencies";

export async function updateUser_UseCase(user: User, updateId: User['id'], payload: UpdateUserDto) {
   const updateCandidate = await userServiceInstance.findOneById(updateId);
   if (!updateCandidate) throw new HttpError(400, "Update candidate not found");

   if (canUpdateUser(user, updateCandidate)) {
      return await userServiceInstance.update(updateId, payload);
   }
   throw new HttpError(401, "You are not allowed to update this user");
}

function canUpdateUser(actor: User, target: User) {
   if (actor.role === Role.ADMIN)
      return true;
   if (actor.id === target.id)
      return true;
   return false;
}