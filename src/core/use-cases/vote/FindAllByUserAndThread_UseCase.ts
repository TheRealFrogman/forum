import { EndpointResult } from "@/core/routing/routes";
import { UseCase } from "../UseCase"
import { User } from "@/core/domain/user/entities/user.entity";
import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { inject, injectable } from "inversify";
import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface";
import { Vote } from "@/core/domain/vote/entities/vote.entity";

@injectable()
export class FindAllByUserAndThread_UseCase extends UseCase {
   constructor(
      @inject(ISqlDatabase) private readonly database: ISqlDatabase,
   ) {
      super();
   }
   override async execute(userId: User['id'], threadId: Thread['id']): Promise<EndpointResult> {
      const result = await this.database.query(
         `SELECT * FROM votes WHERE comment_id IN (
            SELECT id FROM comments WHERE thread_id = $1
         ) AND user_id = $2`,
         [threadId, userId],
         Vote,
         { isArray: true },
      )
      console.log(result)
      return { statusCode: 200, responseModel: result, }
   }
}