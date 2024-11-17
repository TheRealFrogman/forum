import { HttpError } from "@/core/exceptions/HttpError";
import { userServiceInstance } from "@/dependencies";
import { Role, User } from "@/core/domain/user/entities/user.entity";

export async function deleteUser_UseCase(user: User, deleteId: User['id']) {
   const deleteCandidate = await userServiceInstance.findOneById(deleteId);
   if (!deleteCandidate)
      throw new HttpError(400, 'Delete candidate not found');

   if (canDeleteUser(user, deleteCandidate)) {
      const user = await userServiceInstance.delete(deleteCandidate);
      return user!;
   }

   throw new HttpError(401, 'You are not allowed to delete this user');
}

function canDeleteUser(actor: User, target: User): boolean {
   if (actor.role === Role.ADMIN)
      return true;
   if (actor.id === target.id)
      return true;

   return false;
}