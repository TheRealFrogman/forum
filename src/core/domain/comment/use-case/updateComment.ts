import { UpdateCommentDto } from "@/core/domain/comment/dto/update-comment.dto";
import { Comment } from "@/core/domain/comment/entities/comment.entity";
import { Role, User } from "@/core/domain/user/entities/user.entity";
import { HttpError } from "@/core/exceptions/HttpError";
import { commentServiceInstance } from "@/dependencies";

export async function updateComment_UseCase(user: User, id: Comment['id'], body: UpdateCommentDto) {
   const comment = await commentServiceInstance.findOne(id);
   if (!comment) throw new HttpError(404, "Comment not found");

   if (canUpdateComment(user, comment))
      return await commentServiceInstance.update(id, body);
   else
      throw new HttpError(401, "You are not allowed to update this comment");
}

function canUpdateComment(user: User, comment: Comment) {
   return comment.author_id === user.id || user.role === Role.ADMIN;
}