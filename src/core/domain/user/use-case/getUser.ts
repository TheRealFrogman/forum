import { userServiceInstance } from "@/dependencies";
import { User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/routing/routes";

export async function getUser_UseCase(username?: string, id?: User['id']): Promise<EndpointResult> {
   if (id && !username)
      return { statusCode: 200, responseModel: await userServiceInstance.findOneById(id) }

   if (username && !id)
      return { statusCode: 200, responseModel: await userServiceInstance.findUserByUsername(username) }

   return { statusCode: 400, statusMessage: "No id or username provided" };
}