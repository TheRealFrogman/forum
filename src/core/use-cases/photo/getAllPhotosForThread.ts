import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { UseCase } from "../UseCase";
import { injectable } from "inversify";
import { EndpointResult } from "@/core/routing/routes";

@injectable()
export class GetAllPhotosForThread_UseCase extends UseCase {
   async execute(_threadId: Thread['id']): Promise<EndpointResult> {
      throw new Error("Not implemented");
   }
}
