import { userServiceInstance } from "@/dependencies";
import { User } from "../user/entities/user.entity";
import { HttpError } from "@/core/exceptions/HttpError";

export async function getUser_UseCase(username?: string, id?: User['id']) {
   if (id && !username) {
      return await userServiceInstance.findOneById(id);
   }
   if (username && !id) {
      return await userServiceInstance.findUserByUsername(username);
   }
   throw new HttpError(400);
}