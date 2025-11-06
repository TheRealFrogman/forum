import { UpdateCommentDto } from "@/core/domain/comment/dto/update-comment.dto";
import { Comment } from "@/core/domain/comment/entities/comment.entity";
import { Role, User } from "@/core/domain/user/entities/user.entity";
import { EndpointResult } from "@/core/routing/reused-code/routes";

import { CommentService } from "@/core/domain/comment/service/comment.service";
import { UseCase } from "../UseCase";
import { inject, injectable } from "inversify";

@injectable()
export class UpdateComment_UseCase extends UseCase {
   constructor(
      @inject(CommentService) private readonly commentService: CommentService,
   ) {
      super();
   }

   async execute(user: User, id: Comment['id'], body: UpdateCommentDto): Promise<EndpointResult> {
      const comment = await this.commentService.findOne(id);
      if (!comment)
         return { statusCode: 404, statusMessage: "Comment not found" };

      if (this.canDo(user, comment))
         return { statusCode: 200, responseModel: await this.commentService.update(id, body) };
      else
         return { statusCode: 401, statusMessage: "You are not allowed to update this comment" };
   }

   override canDo(user: User, comment: Comment) {
      return comment.author_id === user.id || user.role === Role.ADMIN;
   }
}
