import { UpdateThreadDto } from "@/core/domain/thread/dto/update-thread.dto";
import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { Role, User } from "@/core/domain/user/entities/user.entity";
import { HttpError } from "@/core/exceptions/HttpError";
import { threadServiceInstance } from "@/dependencies";

export async function updateThread_UseCase(user: User, id: Thread['id'], body: UpdateThreadDto) {
   const thread = await threadServiceInstance.findOne(id);
   if (!thread) throw new HttpError(404, "Thread not found");

   if (canUpdateThread(user, thread))
      return await threadServiceInstance.update(id, body);
   else
      throw new HttpError(401, "You are not allowed to update this thread");
}

function canUpdateThread(user: User, thread: Thread) {
   return thread.author_id === user.id || user.role === Role.ADMIN;
}   