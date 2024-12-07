import { inject, injectable } from "inversify";
import { UseCase } from "../UseCase";
import { EndpointResult } from "@/core/routing/routes";
import { Thread } from "@/core/domain/thread/entities/thread.entity";
import { PgCursorDatabase } from "@/core/ports/database/pg-cursor-database/pg-cursor-database";
import { randomUUID, UUID } from "crypto";

type MyTimestampedCursor = {
   id: UUID,
   cursor: Awaited<ReturnType<PgCursorDatabase["createCursor"]>>,
   lastUsedTimestamp: number
}
class Cursors {
   private readonly timeToDie = 5 * 60 * 1000;
   constructor() {
      setInterval(() => {
         const limitDate = Date.now() - this.timeToDie;
         const outdatedCursors = this.cursors.filter(item => item.lastUsedTimestamp < limitDate);
         outdatedCursors.forEach(item => this.deleteTimeoutedCursorById(item.id));
      }, 60 * 1000);
   }
   private cursors: MyTimestampedCursor[] = [];
   getTimeoutedCursorByIdForUsage(id: string) {
      const result = this.cursors.find(item => item.id === id);
      if (result)
         result.lastUsedTimestamp = Date.now();

      return result;
   }
   deleteTimeoutedCursorById(id: string) {
      const index = this.cursors.findIndex(item => item.id === id);
      if (index === -1) {
         throw new Error("Cursor does not exist");
      }

      const deletedCursor = this.cursors.splice(index, 1)[0];
      deletedCursor.cursor.release();
   }
   addCursor(cursorInput: {
      id: UUID,
      cursor: Awaited<ReturnType<PgCursorDatabase["createCursor"]>>,
   }) {
      const newTimeoutedCursor = { ...cursorInput, lastUsedTimestamp: Date.now() };
      this.cursors.push(newTimeoutedCursor);
      return newTimeoutedCursor;
   }
}


@injectable()
export class GetThreadsCursor_UseCase extends UseCase {
   constructor(
      @inject(PgCursorDatabase) private readonly pgCursorDatabase: PgCursorDatabase,
   ) {
      super();
   }
   private readonly cursors = new Cursors();
   override async execute(
      amountToRead: number,
      orderBy: keyof Thread,
      direction: "ascending" | "descending",
      categoryId: string,
      cursorId: UUID
   ): Promise<EndpointResult> {
      let timeoutedCursor = this.cursors.getTimeoutedCursorByIdForUsage(cursorId);

      if (!timeoutedCursor) {
         const cursor = await this.pgCursorDatabase.createCursor("SELECT * FROM threads WHERE category_id = $1 ORDER BY $2 " + (direction === "ascending" ? "ASC" : "DESC"), [categoryId, orderBy], Thread);

         timeoutedCursor = this.cursors.addCursor({ cursor, id: cursorId = randomUUID() });
      }
      const threads = await timeoutedCursor.cursor.read(amountToRead);


      return { statusCode: 200, responseModel: { threads, cursorId } };
   }
}

