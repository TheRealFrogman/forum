import { EndpointResult } from "@/core/routing/routes";

import { myContainer } from "@/inversify.config";
import { ThreadService } from "../service/thread.service";
const threadServiceInstance = myContainer.get<ThreadService>(ThreadService);
export async function getAllThreads_UseCase(): Promise<EndpointResult> {
   return { statusCode: 200, responseModel: await threadServiceInstance.findAll() };
}