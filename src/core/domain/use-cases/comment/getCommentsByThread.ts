import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { EndpointResult } from "@/core/routing/routes";

import { CommentService } from "@/core/domain/comment/service/comment.service";
import { myContainer } from "@/inversify.config";
const commentServiceInstance = myContainer.get<CommentService>(CommentService);

export async function getCommentsByThread_UseCase(threadId: Thread['id']): Promise<EndpointResult> {
   return { statusCode: 200, responseModel: await commentServiceInstance.findAllByThread(threadId) };
}