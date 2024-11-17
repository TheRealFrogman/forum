import { Comment } from "@/core/domain/comment/entities/comment.entity";
import { Role, User } from "@/core/domain/user/entities/user.entity";
import { commentServiceInstance } from "@/dependencies";
import { EndpointResult } from "@/routing/routes";

export async function deleteComment_UseCase(user: User, id: Comment['id']): Promise<EndpointResult> {
   const comment = await commentServiceInstance.findOne(id);
   if (!comment)
      return { statusCode: 404, statusMessage: "Comment not found" };

   if (canDeleteComment(user, comment))
      return { statusCode: 204, statusMessage: "Comment deleted" };
   else
      return { statusCode: 401, statusMessage: "You are not allowed to delete this comment" };
}

function canDeleteComment(user: User, comment: Comment) {
   return comment.author_id === user.id || user.role === Role.ADMIN;
}