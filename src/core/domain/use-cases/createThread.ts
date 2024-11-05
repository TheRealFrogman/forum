import { localAuthenticatorInstance, threadServiceInstance, userServiceInstance } from "@/dependencies";
import { CreateThreadDto } from "../thread/dto/create-thread.dto";
import { Creds } from "./types/Creds";
import { HttpError } from "@/core/exceptions/HttpError";

export async function createThread_UseCase({ password, username }: Creds, body: CreateThreadDto) {
   const user = await localAuthenticatorInstance.authenticate(username, password);
   if (!user) throw new HttpError(401);

   return await threadServiceInstance.create(body);
}