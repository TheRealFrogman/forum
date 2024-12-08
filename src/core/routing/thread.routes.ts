import { receiveBody } from "@/core/lib/receiveBody";
import { CreateThreadDto } from "@/core/domain/thread/dto/create-thread.dto";
import { Routes } from "@/core/routing/routes";
import { getSessionUser } from "@/core/routing/reused-code/helpers/getSessionUser.helper";

import { myContainer } from "@/inversify.config";
import { IJsonschemaValidator } from "@/core/ports/jsonschema-validation/jsonschema-validator.interface";

import { GetThreadsByUser_UseCase } from "../use-cases/thread/getThreadsByAuthor";
import { CreateThread_UseCase } from "../use-cases/thread/createThread";
import { UpdateThread_UseCase } from "../use-cases/thread/updateThread";
import { CategoryService } from "../domain/category/service/category.service";
import { GetThreadsParametrised_UseCase } from "../use-cases/thread/getThreadsParametrised";
import { Thread } from "../domain/thread/entities/thread.entity";
import { GetAllThreads_UseCase } from "../use-cases/thread/getAllThreads";
// import { GetAllPhotosForThread_UseCase } from "../domain/use-cases/photo/getAllPhotosForThread";
// const getAllPhotosForThread_UseCase = myContainer.get(GetAllPhotosForThread_UseCase);

export const threadRoutes: Routes<'/threads' | "/threads/all"> = {
   ["/threads/all"]: {
      GET:
         async () => {
            if (process.env["ENV"] === "dev")
               return await myContainer.get(GetAllThreads_UseCase).execute();

            throw new Error("Allowed only in dev environment");
         }
   },
   ["/threads"]: {
      GET: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);
         const page = url.searchParams.get('page');
         const limit = url.searchParams.get('limit');
         const orderBy = url.searchParams.get('order_by');
         const direction = url.searchParams.get('direction')
         const categoryId = url.searchParams.get('category_id');

         const isPagingParamsMissing = !page || !limit || !orderBy || !direction || !categoryId;
         if (isPagingParamsMissing) {
            const user = await getSessionUser(request);
            if (!user)
               return { statusCode: 401, statusMessage: "Invalid session" };

            return await myContainer.get(GetThreadsByUser_UseCase).execute(user.id);
         }

         const validatedPage = Number.parseInt(page);
         const validatedLimit = Number.parseInt(limit);
         if (isNaN(validatedPage) || isNaN(validatedLimit) || validatedPage <= 0 || validatedLimit <= 0)
            return { statusCode: 400, statusMessage: "Invalid query params" };

         const validatedOrderBy = orderBy as keyof Thread;
         if (!["id", "title", "created_at", "updated_at"].includes(validatedOrderBy))
            return { statusCode: 400, statusMessage: "Invalid sortBy query param" };

         const validatedDirection = direction as "ascending" | "descending";
         if (!["ascending", "descending"].includes(validatedDirection))
            return { statusCode: 400, statusMessage: "Invalid order query param" };


         const categoryService = myContainer.get(CategoryService);
         const category = await categoryService.getCategory(categoryId);
         if (!category)
            return { statusCode: 400, statusMessage: "Invalid categoryId query param" };

         return myContainer.get(GetThreadsParametrised_UseCase).execute(
            validatedPage,
            validatedLimit,
            validatedOrderBy,
            validatedDirection,
            categoryId,
         );
      },
      POST: async (request) => {
         const user = await getSessionUser(request);
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" };

         const body = await receiveBody<CreateThreadDto>(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };

         const [validatedBody, error] = myContainer.get(IJsonschemaValidator).assertBySchemaOrThrow<CreateThreadDto>(body, CreateThreadDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         return await myContainer.get(CreateThread_UseCase).execute(user, validatedBody);
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

         const [validatedBody, error] = myContainer.get(IJsonschemaValidator).assertBySchemaOrThrow<CreateThreadDto>(body, CreateThreadDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         return await myContainer.get(UpdateThread_UseCase).execute(user, id, validatedBody);
      }
   }
};
