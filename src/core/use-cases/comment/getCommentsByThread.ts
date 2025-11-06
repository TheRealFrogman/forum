import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { EndpointResult } from "@/core/routing/reused-code/routes";

import { CommentService } from "@/core/domain/comment/service/comment.service";
import { UseCase } from "../UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class GetCommentsByThread_UseCase extends UseCase {
   constructor(
      @inject(CommentService) private readonly commentService: CommentService,
   ) {
      super();
   }
   async execute(threadId: Thread['id']): Promise<EndpointResult> {
      return { statusCode: 200, responseModel: await this.commentService.findAllByThread(threadId) };
   }
}

