import { Comment } from "@/core/domain/comment/entities/comment.entity";
import { EndpointResult } from "@/core/routing/reused-code/routes";

import { UseCase } from "@/core/use-cases/UseCase";
import { inject, injectable } from "inversify";
import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface";

@injectable()
export class GetCommentByThreadIdAndLocalId extends UseCase {
   constructor(
      @inject(ISqlDatabase) private readonly database: ISqlDatabase,
   ) {
      super();
   }

   async execute(threadId: Comment["local_id"], localId: Comment['local_id']): Promise<EndpointResult> {
      const result = await this.database.query(
         `SELECT * FROM comments
         WHERE thread_id = $1
         AND local_id = $2`,
         [threadId, localId],
         Comment,
         { isArray: true },
      )
      console.log(result)
      return { statusCode: 200, responseModel: result, }
   }
}
