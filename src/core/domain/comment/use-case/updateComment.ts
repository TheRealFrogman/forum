import { UpdateCommentDto } from "@/core/domain/comment/dto/update-comment.dto";
import { Comment } from "@/core/domain/comment/entities/comment.entity";
import { Role, User } from "@/core/domain/user/entities/user.entity";
import { commentServiceInstance } from "@/inversify.config";
import { EndpointResult } from "@/core/routing/routes";

export async function updateComment_UseCase(user: User, id: Comment['id'], body: UpdateCommentDto): Promise<EndpointResult> {
   const comment = await commentServiceInstance.findOne(id);
   if (!comment)
      return { statusCode: 404, statusMessage: "Comment not found" };

   if (canUpdateComment(user, comment))
      return { statusCode: 200, responseModel: await commentServiceInstance.update(id, body) };
   else
      return { statusCode: 401, statusMessage: "You are not allowed to update this comment" };
}

function canUpdateComment(user: User, comment: Comment) {
   return comment.author_id === user.id || user.role === Role.ADMIN;
}