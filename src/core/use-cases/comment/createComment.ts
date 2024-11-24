import { CreateCommentDto } from "@/core/domain/comment/dto/create-comment.dto";
import { User } from "@/core/domain/user/entities/user.entity";
import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { EndpointResult } from "@/core/routing/routes";

import { CommentService } from "@/core/domain/comment/service/comment.service";
import { ThreadService } from "@/core/domain/thread/service/thread.service";
import { UseCase } from "@/core/use-cases/UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class CreateComment_UseCase extends UseCase {
   constructor(
      @inject(ThreadService) private readonly threadService: ThreadService,
      @inject(CommentService) private readonly commentService: CommentService,
   ) {
      super();
   }

   async execute(user: User, body: CreateCommentDto): Promise<EndpointResult> {
      const thread = await this.threadService.findOne(body.thread_id);
      if (!thread)
         return { statusCode: 404, statusMessage: "Thread not found" };
   
      if (this.canDo(user, thread))
         return { statusCode: 201, responseModel: await this.commentService.create(body) };
      else
         return { statusCode: 401, statusMessage: "You are not allowed to comment on this thread" };
   }
   override canDo(_user: User, _thread: Thread) {
      return true;
   }
}
