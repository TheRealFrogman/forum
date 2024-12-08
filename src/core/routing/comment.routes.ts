
import { Routes } from "@/core/routing/routes";
import { receiveBody } from "@/core/lib/receiveBody";
import { CreateCommentDto } from "@/core/domain/comment/dto/create-comment.dto";
import { UpdateCommentDto } from "@/core/domain/comment/dto/update-comment.dto";
import { getSessionUser } from "@/core/routing/reused-code/helpers/getSessionUser.helper";

import { myContainer } from "@/inversify.config";
import { IJsonschemaValidator } from "@/core/ports/jsonschema-validation/jsonschema-validator.interface";
import { CreateComment_UseCase } from "../use-cases/comment/createComment";
import { UpdateComment_UseCase } from "../use-cases/comment/updateComment";
import { GetCommentsByThread_UseCase } from "../use-cases/comment/getCommentsByThread";
import { DeleteComment_UseCase } from "../use-cases/comment/deleteComment";
const jsonschemaValidatorInstance = myContainer.get(IJsonschemaValidator)
const createComment_UseCase = myContainer.get(CreateComment_UseCase);
const updateComment_UseCase = myContainer.get(UpdateComment_UseCase);
const getCommentsByThread_UseCase = myContainer.get(GetCommentsByThread_UseCase);
const deleteComment_UseCase = myContainer.get(DeleteComment_UseCase);
export const commentRoutes: Routes<'/comments'> = {
   ["/comments"]: {
      GET: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);
         const threadId = url.searchParams.get('thread_id');
         if (!threadId)
            return { statusCode: 400, statusMessage: "Thread ID is required" };

         return await getCommentsByThread_UseCase.execute(threadId);
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

         return await createComment_UseCase.execute(user, validatedBody);
      },
      PUT: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);
         const commentId = url.searchParams.get('comment_id');
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

         return await updateComment_UseCase.execute(user, commentId, validatedBody);
      },
      DELETE: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);

         const commentId = url.searchParams.get('comment_id');
         if (!commentId)
            return { statusCode: 400, statusMessage: "Comment ID is required" };

         const user = await getSessionUser(request);
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" };

         return await deleteComment_UseCase.execute(user, commentId);
      },
   }
};
