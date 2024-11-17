import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { commentServiceInstance } from "@/dependencies";

export async function getCommentsByThread_UseCase(threadId: Thread['id']) {
   return await commentServiceInstance.findAllByThread(threadId);
}