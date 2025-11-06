import { inject, injectable } from "inversify";
import { UseCase } from "../UseCase";
import { EndpointResult } from "@/core/routing/reused-code/routes";
import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { PaginatedDatabase } from "@/core/ports/database/paginated-database/PaginatedDatabase";

@injectable()
export class GetThreadsParametrised_UseCase extends UseCase {
   constructor(
      @inject(PaginatedDatabase) private readonly paginatedDatabase: PaginatedDatabase,
   ) {
      super();
   }

   override async execute(
      page: number,
      pageSize: number,
      orderBy: keyof Thread,
      direction: "ascending" | "descending",
      categoryId: string
   ): Promise<EndpointResult> {
      const result = await this.paginatedDatabase.getPaginated("threads", Thread, page, pageSize, orderBy, direction, "where category_id = $1", [categoryId]);
      console.log(result);
      return { statusCode: 200, responseModel: result };
   }
}