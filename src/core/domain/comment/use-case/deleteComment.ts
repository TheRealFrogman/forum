import { Comment } from "@/core/domain/comment/entities/comment.entity";
import { Role, User } from "@/core/domain/user/entities/user.entity";
import { HttpError } from "@/core/exceptions/HttpError";
import { commentServiceInstance } from "@/dependencies";

export async function deleteComment_UseCase(user: User, id: Comment['id']) {
   const comment = await commentServiceInstance.findOne(id);
   if (!comment) throw new HttpError(404, "Comment not found");

   if (canDeleteComment(user, comment))
      return commentServiceInstance.delete(id);
   else
      throw new HttpError(401, "You are not allowed to delete this comment");
}

function canDeleteComment(user: User, comment: Comment) {
   return comment.author_id === user.id || user.role === Role.ADMIN;
}