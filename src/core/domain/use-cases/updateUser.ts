import { UpdateUserDto } from "@/core/domain/user/dto/update-user.dto";
import { User } from "@/core/domain/user/entities/user.entity";
import { HttpError } from "@/core/exceptions/HttpError";

import { localAuthenticatorInstance, userServiceInstance } from "@/dependencies";
import { Creds } from "./types/Creds";

export async function updateUser_UseCase({ password, username }: Creds, updateId: User['id'], payload: UpdateUserDto) {
   const updateCandidate = await userServiceInstance.findOneById(updateId);
   if (!updateCandidate) throw new HttpError(400);

   const authUser = await localAuthenticatorInstance.authenticate(username, password);
   if (!authUser) throw new HttpError(401);

   if (authUser.canUpdate(updateCandidate)) {
      return await userServiceInstance.update(updateId, payload);
   }
   throw new HttpError(401);
}