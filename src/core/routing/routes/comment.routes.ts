import { getCommentsByThread_UseCase } from "@/core/domain/comment/use-case/getCommentsByThread";
import { createComment_UseCase } from "@/core/domain/comment/use-case/createComment";
import { updateComment_UseCase } from "@/core/domain/comment/use-case/updateComment";
import { deleteComment_UseCase } from "@/core/domain/comment/use-case/deleteComment";

import { Routes } from "@/core/routing/routes";
import { receiveBody } from "@/core/lib/receiveBody";
import { CreateCommentDto } from "@/core/domain/comment/dto/create-comment.dto";
import { UpdateCommentDto } from "@/core/domain/comment/dto/update-comment.dto";
import { getSessionUser } from "../reused-code/helpers/getSessionUser.helper";

import { myContainer } from "@/inversify.config";
import { IJsonschemaValidator } from "@/core/ports/jsonschema-validation/jsonschema-validator.interface";
const jsonschemaValidatorInstance = myContainer.get(IJsonschemaValidator)
export const commentRoutes: Routes<'/comments'> = {
   ["/comments"]: {
      GET: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);
         const threadId = url.searchParams.get('threadId');
         if (!threadId)
            return { statusCode: 400, statusMessage: "Thread ID is required" };

         return await getCommentsByThread_UseCase(threadId);
      },
      POST: async (request) => {
         const user = await getSessionUser(request);
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" };

         const body = await receiveBody(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };
         const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchemaOrThrow<CreateCommentDto>(body, CreateCommentDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         return await createComment_UseCase(user, validatedBody);
      },
      PUT: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);
         const commentId = url.searchParams.get('commentId');
         if (!commentId)
            return { statusCode: 400, statusMessage: "Comment ID is required" };

         const user = await getSessionUser(request);
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" };

         const body = await receiveBody(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };

         const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchemaOrThrow<UpdateCommentDto>(body, UpdateCommentDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         return await updateComment_UseCase(user, commentId, validatedBody);
      },
      DELETE: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);

         const commentId = url.searchParams.get('commentId');
         if (!commentId)
            return { statusCode: 400, statusMessage: "Comment ID is required" };

         const user = await getSessionUser(request);
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" };

         return await deleteComment_UseCase(user, commentId);
      },
   }
};
