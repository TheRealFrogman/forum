import { CreateCommentDto } from "@/core/domain/comment/dto/create-comment.dto";
import { User } from "@/core/domain/user/entities/user.entity";
import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { EndpointResult } from "@/core/routing/routes";

import { myContainer } from "@/inversify.config";
import { CommentService } from "@/core/domain/comment/service/comment.service";
import { ThreadService } from "@/core/domain/thread/service/thread.service";

const commentServiceInstance = myContainer.get(CommentService);
const threadServiceInstance = myContainer.get(ThreadService);
export async function createComment_UseCase(user: User, body: CreateCommentDto): Promise<EndpointResult> {
   const thread = await threadServiceInstance.findOne(body.thread_id);
   if (!thread)
      return { statusCode: 404, statusMessage: "Thread not found" };

   if (canCommentOnThread(user, thread))
      return { statusCode: 201, responseModel: await commentServiceInstance.create(body) };
   else
      return { statusCode: 401, statusMessage: "You are not allowed to comment on this thread" };
}
function canCommentOnThread(_user: User, _thread: Thread) {
   return true;
}