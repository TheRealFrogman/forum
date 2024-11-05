import { commentServiceInstance, threadServiceInstance } from "@/dependencies";
import { CreateCommentDto } from "@/core/domain/comment/dto/create-comment.dto";
import { User } from "@/core/domain/user/entities/user.entity";
import { HttpError } from "@/core/exceptions/HttpError";

export async function createComment_UseCase(user: User, body: CreateCommentDto) {
   const thread = await threadServiceInstance.findOne(body.thread_id);
   if (!thread) throw new HttpError(404, "Thread not found");

   if (user.canCommentOnThread(thread))
      return await commentServiceInstance.create(body);
   else 
      throw new HttpError(401);
}