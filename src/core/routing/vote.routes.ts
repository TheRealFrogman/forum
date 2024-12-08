import { myContainer } from "@/inversify.config";
import { Routes } from "./routes";
import { FindAllByUserAndThread_UseCase } from "../use-cases/vote/FindAllByUserAndThread_UseCase";

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
         //CREATE VOTE
         throw new Error("not implemented");
      },
   },
};
