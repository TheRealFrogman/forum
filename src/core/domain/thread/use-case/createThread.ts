import { threadServiceInstance } from "@/dependencies";
import { CreateThreadDto } from "@/core/domain/thread/dto/create-thread.dto";
import { HttpError } from "@/core/exceptions/HttpError";
import { User } from "@/core/domain/user/entities/user.entity";

export async function createThread_UseCase(user: User, body: CreateThreadDto) {
   if (canCreateThread(user))
      return await threadServiceInstance.create(body);
   else
      throw new HttpError(401, "You are not allowed to create a thread");
}

function canCreateThread(user: User) {
   return true;
}