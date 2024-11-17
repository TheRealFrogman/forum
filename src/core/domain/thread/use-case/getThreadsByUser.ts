import { User } from "@/core/domain/user/entities/user.entity";
import { threadServiceInstance } from "@/dependencies";
import { EndpointResult } from "@/routing/routes";

export async function getThreadsByUser_UseCase(id: User['id']): Promise<EndpointResult> {
   return { statusCode: 200, responseModel: await threadServiceInstance.findAllByUserId(id) };
}