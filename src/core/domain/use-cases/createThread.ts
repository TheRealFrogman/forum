import { localAuthenticatorInstance, threadServiceInstance, userServiceInstance } from "@/dependencies";
import { CreateThreadDto } from "@/core/domain/thread/dto/create-thread.dto";
import { HttpError } from "@/core/exceptions/HttpError";
import { User } from "../user/entities/user.entity";

export async function createThread_UseCase(user: User, body: CreateThreadDto) {
   if (user.canCreateThread())
      return await threadServiceInstance.create(body);
   else
      throw new HttpError(401);
}