import { threadServiceInstance } from "@/dependencies";

export async function getAllThreads_UseCase() {
   return await threadServiceInstance.findAll();
}