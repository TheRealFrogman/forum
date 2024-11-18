import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { EndpointResult } from "@/core/routing/routes";

import { myContainer } from "@/inversify.config";
import { PhotoService } from "../service/photo.service";
const photoServiceInstance = myContainer.get<PhotoService>(PhotoService);
export async function getMainPhotoForThreadIfExists_UseCase(threadId: Thread['id']): Promise<EndpointResult> {
   return { statusCode: 200, responseModel: await photoServiceInstance.getMainPhotoForThread(threadId) };
}