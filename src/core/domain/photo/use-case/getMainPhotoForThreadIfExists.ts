import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { photoServiceInstance } from "@/dependencies";
import { EndpointResult } from "@/routing/routes";

export async function getMainPhotoForThreadIfExists_UseCase(threadId: Thread['id']): Promise<EndpointResult> {
   return { statusCode: 200, responseModel: await photoServiceInstance.getMainPhotoForThread(threadId) };
}