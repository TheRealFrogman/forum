import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "@/core/use-cases/UseCase";
import { User } from "@/core/domain/user/entities/user.entity";
import { inject, injectable } from "inversify";
import { CommentVoteService } from "@/core/domain/comment-vote/service/comment-vote.service";
import { NewCommentVoteDto } from "@/core/domain/comment-vote/dto/new-comment-vote.dto";

@injectable()
export class CreateCommentVote_UseCase extends UseCase {
   constructor(
      @inject(CommentVoteService) private readonly commentVoteService: CommentVoteService,
   ) {
      super();
   }
   override async execute(user: User, createVoteDto: NewCommentVoteDto): Promise<EndpointResult> {
      if (this.canDo(user, createVoteDto))
         return { statusCode: 200, responseModel: await this.commentVoteService.create(createVoteDto) };
      else
         return { statusCode: 401, statusMessage: "You are not allowed to vote on this comment" }
   }
   override canDo(user: User, createVoteDto: NewCommentVoteDto): boolean {
      return user.id === createVoteDto.user_id
   }
}