import { EndpointResult } from "@/core/routing/routes";
import { CommentService } from "@/core/domain/comment/service/comment.service";
import { UseCase } from "../UseCase";
import { inject, injectable } from "inversify";
import { User } from "@/core/domain/user/entities/user.entity";

@injectable()
export class GetCommentsByAuthor_UseCase extends UseCase {
   constructor(
      @inject(CommentService) private readonly commentService: CommentService,
   ) {
      super();
   }
   async execute(authorId: User['id']): Promise<EndpointResult> {
      return { statusCode: 200, responseModel: await this.commentService.findAllByAuthorId(authorId) };
   }
}

