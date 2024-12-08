import { Vote } from "@/core/domain/vote/entities/vote.entity";
import { VoteService } from "@/core/domain/vote/service/vote.service";
import { User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "@/core/use-cases/UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class DeleteVote_UseCase extends UseCase {
   constructor(
      @inject(VoteService) private readonly voteService: VoteService,
   ) {
      super();
   }
   override async execute(user: User, commentVoteId: Vote['id']): Promise<EndpointResult> {
      const commentVoteCandidate = await this.voteService.findOne(commentVoteId)
      if (!commentVoteCandidate)
         return { statusCode: 404, statusMessage: "Comment vote not found" };

      if (this.canDo(user, commentVoteCandidate))
         return { statusCode: 200, statusMessage: "Comment vote deleted", responseModel: await this.voteService.delete(commentVoteId)! };
      else
         return { statusCode: 401, statusMessage: "You are not allowed to delete this comment vote" };
   }
   protected override canDo(user: User, commentVote: Vote): boolean {
      return user.id === commentVote.user_id
   }
}