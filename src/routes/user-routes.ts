import { getUser_UseCase } from "@/core/domain/user/use-case/getUser";
import { UpdateUserDto } from "@/core/domain/user/dto/update-user.dto";
import { updateUser_UseCase } from "@/core/domain/user/use-case/updateUser";
import { deleteUser_UseCase } from "@/core/domain/user/use-case/deleteUser";
import { Routes } from "@/routes/routes";

import { getSessionUser } from "./reused-code/helpers/getSessionUser.helper";
import { parseAndValidateBody } from "./reused-code/helpers/parseAndValidateBody.helper";
export const userRoutes: Routes<'/users'> = {
   ["/users"]: {
      GET: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);

         const id = url.searchParams.get('id') ?? undefined;
         const username = url.searchParams.get('username') ?? undefined;

         return { statusCode: 200, responseModel: await getUser_UseCase(username, id) }
      },
      PATCH: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);

         const id = url.searchParams.get('id')!;
         if (!id)
            return { statusCode: 400, statusMessage: "No body or id provided" }

         const body = await parseAndValidateBody<UpdateUserDto>(request, UpdateUserDto.schema)
         if (!body)
            return { statusCode: 400, statusMessage: "Invalid body" }

         return { statusCode: 200, responseModel: await updateUser_UseCase(await getSessionUser(request), id, body) }
      },

      DELETE: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);
         const id = url.searchParams.get('id')!;
         if (!id)
            return { statusCode: 400, statusMessage: "No id provided" }

         return { statusCode: 204, responseModel: await deleteUser_UseCase(await getSessionUser(request), id) }
      }
   }
}