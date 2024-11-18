import { User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/routes";

import { myContainer } from "@/inversify.config";
import { ThreadService } from "../service/thread.service";

const threadServiceInstance = myContainer.get<ThreadService>(ThreadService);
export async function getThreadsByUser_UseCase(id: User['id']): Promise<EndpointResult> {
   return { statusCode: 200, responseModel: await threadServiceInstance.findAllByUserId(id) };
}