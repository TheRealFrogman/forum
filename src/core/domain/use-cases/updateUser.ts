import { UpdateUserDto } from "@/core/domain/user/dto/update-user.dto";
import { User } from "@/core/domain/user/entities/user.entity";
import { HttpError } from "@/core/exceptions/HttpError";

import { userServiceInstance } from "@/dependencies";

export async function updateUser_UseCase(user: User, updateId: User['id'], payload: UpdateUserDto) {
   const updateCandidate = await userServiceInstance.findOneById(updateId);
   if (!updateCandidate) throw new HttpError(400);

   if (user.canUpdate(updateCandidate)) {
      return await userServiceInstance.update(updateId, payload);
   }
   throw new HttpError(401);
}