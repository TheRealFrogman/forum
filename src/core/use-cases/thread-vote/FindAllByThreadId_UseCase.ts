import { ThreadVoteService } from "@/core/domain/thread-vote/service/thread-vote.service";
import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "@/core/use-cases/UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class FindAllByThreadId_UseCase extends UseCase {
   constructor(
      @inject(ThreadVoteService) private readonly threadVoteService: ThreadVoteService,
   ) {
      super();
   }
   override async execute(threadId: Thread['id']): Promise<EndpointResult> {
      return { statusCode: 200, responseModel: this.threadVoteService.findOne(threadId) }
   }
}