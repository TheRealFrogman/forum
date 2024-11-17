import { threadServiceInstance } from "@/dependencies";
import { EndpointResult } from "@/routing/routes";

export async function getAllThreads_UseCase(): Promise<EndpointResult> {
   return { statusCode: 200, responseModel: await threadServiceInstance.findAll() };
}