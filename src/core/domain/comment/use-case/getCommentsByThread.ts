import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { commentServiceInstance } from "@/dependencies";
import { EndpointResult } from "@/routing/routes";

export async function getCommentsByThread_UseCase(threadId: Thread['id']): Promise<EndpointResult> {
   return { statusCode: 200, responseModel: await commentServiceInstance.findAllByThread(threadId) };
}