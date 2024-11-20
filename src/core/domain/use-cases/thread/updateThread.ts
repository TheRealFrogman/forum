import { UpdateThreadDto } from "@/core/domain/thread/dto/update-thread.dto";
import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { Role, User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/routes";

import { ThreadService } from "@/core/domain/thread/service/thread.service";
import { UseCase } from "../UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class UpdateThread_UseCase extends UseCase {

   constructor(
      @inject(ThreadService) private readonly threadService: ThreadService,
   ) {
      super();
   }

   async execute(user: User, id: Thread['id'], body: UpdateThreadDto): Promise<EndpointResult> {
      const thread = await this.threadService.findOne(id);
      if (!thread)
         return { statusCode: 404, statusMessage: "Thread not found" };
   
      if (this.canDo(user, thread))
         return { statusCode: 200, responseModel: await this.threadService.update(id, body) };
      else
         return { statusCode: 401, statusMessage: "You are not allowed to update this thread" };
   }
   
   override canDo(user: User, thread: Thread) {
      return thread.author_id === user.id || user.role === Role.ADMIN;
   }   
}





