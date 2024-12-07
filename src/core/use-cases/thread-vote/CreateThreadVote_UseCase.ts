import { NewThreadVoteDto } from "@/core/domain/thread-vote/dto/new-thread-vote.dto";
import { ThreadVoteService } from "@/core/domain/thread-vote/service/thread-vote.service";
import { User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "@/core/use-cases/UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class CreateThreadVote_UseCase extends UseCase {
   constructor(
      @inject(ThreadVoteService) private readonly threadVoteService: ThreadVoteService,
   ) {
      super();
   }
   override async execute(user: User, createVoteDto: NewThreadVoteDto): Promise<EndpointResult> {
      if (this.canDo(user, createVoteDto))
         return { statusCode: 200, responseModel: await this.threadVoteService.create(createVoteDto) };
      else
         return { statusCode: 401, statusMessage: "You are not allowed to vote on this thread" }
   }
   protected override canDo(user: User, createVoteDto: NewThreadVoteDto): boolean {
      return user.id === createVoteDto.user_id
   }
}