import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { photoServiceInstance } from "@/dependencies";

export async function getMainPhotoForThreadIfExists_UseCase(threadId: Thread['id']) {
   return await photoServiceInstance.getMainPhotoForThread(threadId);
}