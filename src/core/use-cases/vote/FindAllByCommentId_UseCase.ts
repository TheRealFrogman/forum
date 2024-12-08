import { VoteService } from "@/core/domain/vote/service/vote.service";
import { Comment } from "@/core/domain/comment/entities/comment.entity";
import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "@/core/use-cases/UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class FindAllByCommentId_UseCase extends UseCase {
   constructor(
      @inject(VoteService) private readonly voteService: VoteService,
   ) {
      super();
   }
   override async execute(commentId: Comment['id']): Promise<EndpointResult> {
      return { statusCode: 200, responseModel: this.voteService.findOne(commentId) };
   }
}