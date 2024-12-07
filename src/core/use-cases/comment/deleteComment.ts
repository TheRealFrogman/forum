import { Comment } from "@/core/domain/comment/entities/comment.entity";
import { Role, User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/routes";

import { CommentService } from "@/core/domain/comment/service/comment.service";
import { UseCase } from "@/core/use-cases/UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class DeleteComment_UseCase extends UseCase {
   constructor(
      @inject(CommentService) private readonly commentService: CommentService,
   ) {
      super();
   }

   async execute(user: User, id: Comment['id']): Promise<EndpointResult> {
      const comment = await this.commentService.findOne(id);
      if (!comment)
         return { statusCode: 404, statusMessage: "Comment not found" };

      if (this.canDo(user, comment))
         return { statusCode: 200, statusMessage: "Comment deleted" };
      else
         return { statusCode: 401, statusMessage: "You are not allowed to delete this comment" };
   }

   override canDo(user: User, comment: Comment) {
      return comment.author_id === user.id || user.role === Role.ADMIN;
   }
}
