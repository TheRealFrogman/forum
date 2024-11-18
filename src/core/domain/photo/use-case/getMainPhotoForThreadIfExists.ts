import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { photoServiceInstance } from "@/inversify.config";
import { EndpointResult } from "@/core/routing/routes";

export async function getMainPhotoForThreadIfExists_UseCase(threadId: Thread['id']): Promise<EndpointResult> {
   return { statusCode: 200, responseModel: await photoServiceInstance.getMainPhotoForThread(threadId) };
}