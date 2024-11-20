import { EndpointResult } from "@/core/routing/routes";

import { ThreadService } from "@/core/domain/thread/service/thread.service";
import { UseCase } from "../UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class GetAllThreads_UseCase extends UseCase {
   constructor(
      @inject(ThreadService) private readonly threadService: ThreadService,
   ) {
      super();
   }

   async execute(): Promise<EndpointResult> {
      return { statusCode: 200, responseModel: await this.threadService.findAll() };
   }
}
