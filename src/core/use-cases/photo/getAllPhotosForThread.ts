import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { UseCase } from "../UseCase";
import { injectable } from "inversify";

@injectable()
export class GetAllPhotosForThread_UseCase extends UseCase {
   async execute(_threadId: Thread['id']) {
      throw new Error("Not implemented");
   }
}
