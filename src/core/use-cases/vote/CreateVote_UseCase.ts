import { EndpointResult } from "@/core/routing/reused-code/routes";
import { UseCase } from "@/core/use-cases/UseCase";
import { User } from "@/core/domain/user/entities/user.entity";
import { inject, injectable } from "inversify";
import { VoteService } from "@/core/domain/vote/service/vote.service";
import { NewVoteDto } from "@/core/domain/vote/dto/new-vote.dto";

@injectable()
export class CreateVote_UseCase extends UseCase {
   constructor(
      @inject(VoteService) private readonly voteService: VoteService,
   ) {
      super();
   }
   override async execute(user: User, createVoteDto: NewVoteDto): Promise<EndpointResult> {
      if (this.canDo(user))
         return { statusCode: 200, responseModel: await this.voteService.create({ ...createVoteDto, user_id: user.id }) };
      else
         return { statusCode: 401, statusMessage: "You are not allowed to vote on this comment" }
   }
   override canDo(user: User): boolean {
      return true;
   }
}