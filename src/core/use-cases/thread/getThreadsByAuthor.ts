import { User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/reused-code/routes";

import { ThreadService } from "@/core/domain/thread/service/thread.service";
import { UseCase } from "../UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class GetThreadsByUser_UseCase extends UseCase {
   constructor(
      @inject(ThreadService) private readonly threadService: ThreadService,
   ) {
      super();
   }

   async execute(id: User['id']): Promise<EndpointResult> {
      return { statusCode: 200, responseModel: await this.threadService.findAllByAuthorId(id) };
   }
}
