import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface";
import { inject } from "inversify";
import { NewThreadVoteDto } from "@/core/domain/thread-vote/dto/new-thread-vote.dto";
import { ThreadVote } from "@/core/domain/thread-vote/entities/thread-vote.entity";
import { Thread } from "@/core/domain/thread/entities/thread.entity";

export class ThreadVoteService {
   constructor(
      @inject(ISqlDatabase) private threadVotes: ISqlDatabase,
   ) { }

   async create(createThreadVoteDto: NewThreadVoteDto): Promise<ThreadVote> {
      const result = await this.threadVotes.query(
         `INSERT INTO thread_votes (thread_id, user_id, vote_type) VALUES ($1, $2, $3) RETURNING *`,
         [createThreadVoteDto.thread_id, createThreadVoteDto.user_id, createThreadVoteDto.vote_type],
         ThreadVote,
         { isArray: false }
      );
      return result!;
   }

   async findAllByThread(threadId: Thread['id']): Promise<ThreadVote[]> {
      return await this.threadVotes.query(
         `SELECT * FROM thread_votes WHERE thread_id = $1`,
         [threadId],
         ThreadVote,
         { isArray: true }
      );
   }

   async findOne(id: ThreadVote['id']): Promise<ThreadVote | null> {
      return await this.threadVotes.query(
         `SELECT * FROM thread_votes WHERE id = $1`,
         [id],
         ThreadVote,
         { isArray: false }
      );
   }

   async delete(id: ThreadVote['id']): Promise<ThreadVote | null> {
      return await this.threadVotes.query(
         `DELETE FROM thread_votes WHERE id = $1 RETURNING *`,
         [id],
         ThreadVote,
         { isArray: false }
      );
   }
}
