import { CommentVote } from "@/core/domain/comment-vote/entities/comment-vote.entity";
import { CommentVoteService } from "@/core/domain/comment-vote/service/comment-vote.service";
import { User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "@/core/use-cases/UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class DeleteCommentVote_UseCase extends UseCase {
   constructor(
      @inject(CommentVoteService) private readonly commentVoteService: CommentVoteService,
   ) {
      super();
   }
   override async execute(user: User, commentVoteId: CommentVote['id']): Promise<EndpointResult> {
      const commentVoteCandidate = await this.commentVoteService.findOne(commentVoteId)
      if (!commentVoteCandidate)
         return { statusCode: 404, statusMessage: "Comment vote not found" };

      if (this.canDo(user, commentVoteCandidate))
         return { statusCode: 200, statusMessage: "Comment vote deleted", responseModel: await this.commentVoteService.delete(commentVoteId)! };
      else
         return { statusCode: 401, statusMessage: "You are not allowed to delete this comment vote" };
   }
   protected override canDo(user: User, commentVote: CommentVote): boolean {
      return user.id === commentVote.user_id
   }
}