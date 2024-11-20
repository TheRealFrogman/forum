import { receiveBody } from "@/core/lib/receiveBody";
import { CreateThreadDto } from "@/core/domain/thread/dto/create-thread.dto";
import { Routes } from "@/core/routing/routes";
import { getSessionUser } from "@/core/routing/reused-code/helpers/getSessionUser.helper";

import { myContainer } from "@/inversify.config";
import { IJsonschemaValidator } from "@/core/ports/jsonschema-validation/jsonschema-validator.interface";
import { GetAllThreads_UseCase } from "../domain/use-cases/thread/getAllThreads";
import { GetThreadsByUser_UseCase } from "../domain/use-cases/thread/getThreadsByUser";
import { CreateThread_UseCase } from "../domain/use-cases/thread/createThread";
import { UpdateThread_UseCase } from "../domain/use-cases/thread/updateThread";
const jsonschemaValidatorInstance = myContainer.get(IJsonschemaValidator)
// import { GetAllPhotosForThread_UseCase } from "../domain/use-cases/photo/getAllPhotosForThread";
// const getAllPhotosForThread_UseCase = myContainer.get(GetAllPhotosForThread_UseCase);
const getAllThreads_UseCase = myContainer.get(GetAllThreads_UseCase);
const getThreadsByUser_UseCase = myContainer.get(GetThreadsByUser_UseCase);
const createThread_UseCase = myContainer.get(CreateThread_UseCase);
const updateThread_UseCase = myContainer.get(UpdateThread_UseCase);
export const threadRoutes: Routes<'/threads' | "/threads/all"> = {
   ["/threads/all"]: {
      GET:
         async () => {
            return await getAllThreads_UseCase.execute()
         }
   },
   ["/threads"]: {
      GET: async (request) => {
         const user = await getSessionUser(request);
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" };

         return await getThreadsByUser_UseCase.execute(user.id);
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

         return await createThread_UseCase.execute(user, validatedBody);
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

         return await updateThread_UseCase.execute(user, id, validatedBody);
      }
   }
};
