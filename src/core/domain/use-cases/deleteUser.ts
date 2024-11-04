import { HttpError } from "@/core/exceptions/HttpError";
import { localAuthenticatorInstance, userServiceInstance } from "@/dependencies";
import { User } from "../user/entities/user.entity";

export async function deleteUser_UseCase({ password, username }: { username: string, password: string }, deleteId: User['id']) {
   const authUser = await localAuthenticatorInstance.authenticate(username, password);
   if (!authUser) throw new HttpError(401, "Invalid credentials");

   const deleteCandidate = await userServiceInstance.findOneById(deleteId);
   if (!deleteCandidate)
      throw new HttpError(400);

   if (authUser.canDelete(deleteCandidate)) {
      const user = await userServiceInstance.remove(deleteCandidate);
      return user;
   }

   throw new HttpError(401);
}