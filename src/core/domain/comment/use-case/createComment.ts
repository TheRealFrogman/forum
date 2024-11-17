import { commentServiceInstance, threadServiceInstance } from "@/dependencies";
import { CreateCommentDto } from "@/core/domain/comment/dto/create-comment.dto";
import { User } from "@/core/domain/user/entities/user.entity";
import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { EndpointResult } from "@/routing/routes";

export async function createComment_UseCase(user: User, body: CreateCommentDto): Promise<EndpointResult> {
   const thread = await threadServiceInstance.findOne(body.thread_id);
   if (!thread)
      return { statusCode: 404, statusMessage: "Thread not found" };

   if (canCommentOnThread(user, thread))
      return { statusCode: 201, responseModel: await commentServiceInstance.create(body) };
   else
      return { statusCode: 401, statusMessage: "You are not allowed to comment on this thread" };
}
function canCommentOnThread(user: User, thread: Thread) {
   return true;
}