import { threadServiceInstance } from "@/inversify.config";
import { EndpointResult } from "@/core/routing/routes";

export async function getAllThreads_UseCase(): Promise<EndpointResult> {
   return { statusCode: 200, responseModel: await threadServiceInstance.findAll() };
}