import { HttpError } from "@/core/exceptions/HttpError";
import { localAuthenticatorInstance, userServiceInstance } from "@/dependencies";
import { User } from "@/core/domain/user/entities/user.entity";

import { Creds } from "./types/Creds";
export async function deleteUser_UseCase({ password, username }: Creds, deleteId: User['id']) {
   const authUser = await localAuthenticatorInstance.authenticate(username, password);
   if (!authUser) throw new HttpError(401, "Invalid credentials");

   const deleteCandidate = await userServiceInstance.findOneById(deleteId);
   if (!deleteCandidate)
      throw new HttpError(400);

   if (authUser.canDelete(deleteCandidate)) {
      const user = await userServiceInstance.delete(deleteCandidate);
      return user;
   }

   throw new HttpError(401);
}