import { ThreadVote } from "@/core/domain/thread-vote/entities/thread-vote.entity";
import { ThreadVoteService } from "@/core/domain/thread-vote/service/thread-vote.service";
import { User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "@/core/use-cases/UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class DeleteThreadVote_UseCase extends UseCase {
   constructor(
      @inject(ThreadVoteService) private readonly threadVoteService: ThreadVoteService,
   ) {
      super();
   }
   override async execute(user: User, threadVoteId: ThreadVote['id']): Promise<EndpointResult> {
      const threadVoteCandidate = await this.threadVoteService.findOne(threadVoteId);
      if (!threadVoteCandidate)
         return { statusCode: 404, statusMessage: "Thread vote not found" };

      if (this.canDo(user, threadVoteCandidate))
         return { statusCode: 200, statusMessage: "Thread vote deleted", responseModel: await this.threadVoteService.delete(threadVoteId)! };
      else
         return { statusCode: 401, statusMessage: "You are not allowed to delete this thread vote" };
   }
   protected override canDo(user: User, threadVote: ThreadVote): boolean {
      return user.id === threadVote.user_id
   }
}