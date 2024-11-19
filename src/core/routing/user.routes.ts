import { getUser_UseCase } from "@/core/domain/user/use-case/getUser";
import { UpdateUserDto } from "@/core/domain/user/dto/update-user.dto";
import { updateUser_UseCase } from "@/core/domain/user/use-case/updateUser";
import { deleteUser_UseCase } from "@/core/domain/user/use-case/deleteUser";
import { Routes } from "@/core/routing/routes";

import { receiveBody } from "@/core/lib/receiveBody";
import { getSessionUser } from "@/core/routing/reused-code/helpers/getSessionUser.helper";

import { myContainer } from "@/inversify.config";
import { IJsonschemaValidator } from "@/core/ports/jsonschema-validation/jsonschema-validator.interface";
const jsonschemaValidatorInstance = myContainer.get(IJsonschemaValidator)

export const userRoutes: Routes<'/users'> = {
   ["/users"]: {
      GET: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);

         const id = url.searchParams.get('id') ?? undefined;
         const username = url.searchParams.get('username') ?? undefined;

         return await getUser_UseCase(username, id)
      },
      PATCH: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);

         const id = url.searchParams.get('id')!;
         if (!id)
            return { statusCode: 400, statusMessage: "No body or id provided" }

         const body = await receiveBody<UpdateUserDto>(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };
         const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchemaOrThrow<UpdateUserDto>(body, UpdateUserDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         const user = await getSessionUser(request)
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" }

         return await updateUser_UseCase(user, id, validatedBody)
      },

      DELETE: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);
         const id = url.searchParams.get('id')!;
         if (!id)
            return { statusCode: 400, statusMessage: "No id provided" }

         const user = await getSessionUser(request)
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" }

         return await deleteUser_UseCase(user, id)
      }
   }
}