import { UpdateThreadDto } from "@/core/domain/thread/dto/update-thread.dto";
import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { Role, User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/routes";

import { myContainer } from "@/inversify.config";
import { ThreadService } from "@/core/domain/thread/service/thread.service";
const threadServiceInstance = myContainer.get<ThreadService>(ThreadService);
export async function updateThread_UseCase(user: User, id: Thread['id'], body: UpdateThreadDto): Promise<EndpointResult> {
   const thread = await threadServiceInstance.findOne(id);
   if (!thread)
      return { statusCode: 404, statusMessage: "Thread not found" };

   if (canUpdateThread(user, thread))
      return { statusCode: 200, responseModel: await threadServiceInstance.update(id, body) };
   else
      return { statusCode: 401, statusMessage: "You are not allowed to update this thread" };
}

function canUpdateThread(user: User, thread: Thread) {
   return thread.author_id === user.id || user.role === Role.ADMIN;
}   