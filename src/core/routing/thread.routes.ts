
import { getThreadsByUser_UseCase } from "@/core/domain/use-cases/thread/getThreadsByUser";
import { createThread_UseCase } from "@/core/domain/use-cases/thread/createThread";
import { updateThread_UseCase } from "@/core/domain/use-cases/thread/updateThread";
import { getAllThreads_UseCase } from "@/core/domain/use-cases/thread/getAllThreads";

import { receiveBody } from "@/core/lib/receiveBody";
import { CreateThreadDto } from "@/core/domain/thread/dto/create-thread.dto";
import { Routes } from "@/core/routing/routes";
import { getSessionUser } from "@/core/routing/reused-code/helpers/getSessionUser.helper";

import { myContainer } from "@/inversify.config";
import { IJsonschemaValidator } from "@/core/ports/jsonschema-validation/jsonschema-validator.interface";
const jsonschemaValidatorInstance = myContainer.get(IJsonschemaValidator)
export const threadRoutes: Routes<'/threads' | "/threads/all"> = {
   ["/threads/all"]: {
      GET:
         async () => {
            return await getAllThreads_UseCase()
         }
   },
   ["/threads"]: {
      GET: async (request) => {
         const user = await getSessionUser(request);
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" };

         return await getThreadsByUser_UseCase(user.id);
      },
      POST: async (request) => {
         const user = await getSessionUser(request);
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" };

         const body = await receiveBody<CreateThreadDto>(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };

         const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchemaOrThrow<CreateThreadDto>(body, CreateThreadDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         return await createThread_UseCase(user, validatedBody);
      },
      PATCH: async (request) => {
         const user = await getSessionUser(request);
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" };

         const url = new URL(request.url!, `http://${request.headers.host}`);
         const id = url.searchParams.get('id')!;
         if (!id)
            return { statusCode: 400, statusMessage: "No id provided" }

         const body = await receiveBody<CreateThreadDto>(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };

         const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchemaOrThrow<CreateThreadDto>(body, CreateThreadDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         return await updateThread_UseCase(user, id, validatedBody);
      }
   }
};
