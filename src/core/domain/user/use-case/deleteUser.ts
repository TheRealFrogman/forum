import { Role, User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/routes";

import { myContainer } from "@/inversify.config";
import { UserService } from "@/core/domain/user/service/user.service";

const userServiceInstance = myContainer.get<UserService>(UserService);
export async function deleteUser_UseCase(user: User, deleteId: User['id']): Promise<EndpointResult> {
   const deleteCandidate = await userServiceInstance.findOneById(deleteId);
   if (!deleteCandidate)
      return { statusCode: 400, statusMessage: "Delete candidate not found" };

   if (canDeleteUser(user, deleteCandidate)) {
      const user = await userServiceInstance.delete(deleteCandidate);
      return { statusCode: 204, statusMessage: "User deleted", responseModel: user };
   }

   return { statusCode: 401, statusMessage: "You are not allowed to delete this user" };
}

function canDeleteUser(actor: User, target: User): boolean {
   if (actor.role === Role.ADMIN)
      return true;
   if (actor.id === target.id)
      return true;

   return false;
}