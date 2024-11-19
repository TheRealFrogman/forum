import { getMainPhotoForThreadIfExists_UseCase } from "@/core/domain/use-cases/photo/getMainPhotoForThreadIfExists";
import { Routes } from "@/core/routing/routes";

// import { getAllPhotosForThread_UseCase } from "@/core/domain/photo/use-case/getAllPhotosForThread";
// import { jsonschemaValidatorInstance } from "@/dependencies";
// import { receiveBody } from "@/core/lib/receiveBody";
// import { getSessionUser } from "./reused-code/helpers/getSessionUser.helper";

export const photoRoutes: Routes<'/photos'> = {
   ["/photos"]: {
      GET: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);
         const threadId = url.searchParams.get('threadId');
         if (!threadId)
            return { statusCode: 400, statusMessage: "No threadId provided" };

         return await getMainPhotoForThreadIfExists_UseCase(threadId);
      },
      //  POST: async (request) => {
      //    const user = await getSessionUser(request);
      //    if (!user) 
      //      return { statusCode: 401, statusMessage: "Invalid session" };

      //    const body = await receiveBody<CreatePhotoDto>(request);
      //    if (!body) 
      //      return { statusCode: 400, statusMessage: "No body" };
      //    jsonschemaValidatorInstance.assertBySchemaOrThrow<CreatePhotoDto>(body, CreatePhotoDto.schema);

      //    // Assuming a createPhoto_UseCase is defined elsewhere
      //    return await createPhoto_UseCase(user, body);
      //  },
   }
};
