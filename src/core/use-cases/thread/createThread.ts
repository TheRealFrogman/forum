import { CreateThreadDto } from "@/core/domain/thread/dto/create-thread.dto";
import { User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/routes";

import { ThreadService } from "@/core/domain/thread/service/thread.service";
import { UseCase } from "../UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class CreateThread_UseCase extends UseCase {

   constructor(
      @inject(ThreadService) private readonly threadService: ThreadService,
   ) {
      super();
   }
   async execute(user: User, body: CreateThreadDto): Promise<EndpointResult> {
      if (this.canDo(user))
         return { statusCode: 201, responseModel: await this.threadService.create(body) };
      else
         return { statusCode: 401, statusMessage: "You are not allowed to create a thread, please confirm your email" }
   }

   override canDo(user: User) {
      return user.email_confirmed;
   }
}
