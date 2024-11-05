import { HttpError } from "@/core/exceptions/HttpError";
import { localAuthenticatorInstance, userServiceInstance } from "@/dependencies";
import { User } from "@/core/domain/user/entities/user.entity";

export async function deleteUser_UseCase(user: User, deleteId: User['id']) {
   const deleteCandidate = await userServiceInstance.findOneById(deleteId);
   if (!deleteCandidate)
      throw new HttpError(400);

   if (user.canDelete(deleteCandidate)) {
      const user = await userServiceInstance.delete(deleteCandidate);
      return user;
   }

   throw new HttpError(401);
}