import { threadServiceInstance } from "@/inversify.config";
import { CreateThreadDto } from "@/core/domain/thread/dto/create-thread.dto";
import { User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/routes";

export async function createThread_UseCase(user: User, body: CreateThreadDto): Promise<EndpointResult> {
   if (canCreateThread(user))
      return { statusCode: 201, responseModel: await threadServiceInstance.create(body) };
   else
      return { statusCode: 401, statusMessage: "You are not allowed to create a thread" }
}

function canCreateThread(user: User) {
   return true;
}