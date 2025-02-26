import { myContainer } from "@/inversify.config";
import { Routes } from "./routes";
import { FindAllByUserAndThread_UseCase } from "../use-cases/vote/FindAllByUserAndThread_UseCase";
import { receiveBody } from "../lib/receiveBody";
import { NewVoteDto } from "../domain/vote/dto/new-vote.dto";
import { IJsonschemaValidator } from "../ports/jsonschema-validation/jsonschema-validator.interface";
import { getSessionUser } from "./reused-code/helpers/getSessionUser.helper";
import { CreateVote_UseCase } from "../use-cases/vote/CreateVote_UseCase";
import { DeleteVote_UseCase } from "../use-cases/vote/DeleteVote_UseCase";


const jsonschemaValidatorInstance = myContainer.get(IJsonschemaValidator);

export const votesRoutes: Routes<'/votes'> = {
   ["/votes"]: {
      GET: async (request) => {
         const url = new URL(request.url!, `http://${request.headers.host}`);

         const threadId = url.searchParams.get('thread_id');
         if (!threadId)
            return { statusCode: 400, statusMessage: "Thread ID is required" };
         const userId = url.searchParams.get('user_id');
         if (!userId)
            return { statusCode: 400, statusMessage: "User ID is required" };

         return myContainer.get(FindAllByUserAndThread_UseCase).execute(userId, threadId);
      },

      POST: async (request) => {
         const user = await getSessionUser(request);
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" };

         const body = await receiveBody<NewVoteDto>(request);
         if (!body)
            return { statusCode: 400, statusMessage: "No body" };
         const [validatedBody, error] = jsonschemaValidatorInstance.assertBySchema<NewVoteDto>(body, NewVoteDto.schema);
         if (error)
            return { statusCode: 400, statusMessage: error.message, responseModel: error }

         return myContainer.get(CreateVote_UseCase).execute(user, validatedBody);
      },

      DELETE: async (request) => {
         const user = await getSessionUser(request);
         if (!user)
            return { statusCode: 401, statusMessage: "Invalid session" };

         const url = new URL(request.url!, `http://${request.headers.host}`);
         const commentId = url.searchParams.get('comment_id');
         if (!commentId)
            return { statusCode: 400, statusMessage: "Thread ID is required" };

         return myContainer.get(DeleteVote_UseCase).execute(user, commentId);
      }
   },
};
