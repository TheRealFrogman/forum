import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { EndpointResult } from "@/core/routing/routes";

import { UseCase } from "../UseCase";
import { PhotoService } from "../../photo/service/photo.service";
import { inject, injectable } from "inversify";

@injectable()
export class GetMainPhotoForThreadIfExists_UseCase extends UseCase {
   constructor(
      @inject(PhotoService) private readonly photoService: PhotoService,
   ) {
      super();
   }

   async execute(threadId: Thread['id']): Promise<EndpointResult> {
      return { statusCode: 200, responseModel: await this.photoService.getMainPhotoForThread(threadId) };
   }
}
