import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface";
import { inject } from "inversify";
import { NewVoteDto } from "@/core/domain/vote/dto/new-vote.dto";
import { Vote } from "@/core/domain/vote/entities/vote.entity";
import { Comment } from "@/core/domain/comment/entities/comment.entity";
import { User } from "../../user/entities/user.entity";

export class VoteService {
   constructor(
      @inject(ISqlDatabase) private commentVotes: ISqlDatabase,
   ) { }
   async create(createCommentVoteDto: NewVoteDto): Promise<Vote> {
      const result = await this.commentVotes.query(
         `INSERT INTO votes (comment_id, user_id, vote_type) VALUES ($1, $2, $3) RETURNING *`,
         [createCommentVoteDto.comment_id, createCommentVoteDto.user_id, createCommentVoteDto.vote_type],
         Vote,
         { isArray: false }
      );
      return result!;
   }

   async findAllByComment(commentId: Comment['id']): Promise<Vote[]> {
      return await this.commentVotes.query(
         `SELECT * FROM votes WHERE comment_id = $1`,
         [commentId],
         Vote,
         { isArray: true }
      );
   }

   async findOne(userId: User['id'], commentId: Comment['id']): Promise<Vote | null> {
      return await this.commentVotes.query(
         `SELECT * FROM votes WHERE user_id = $1 AND comment_id = $2`,
         [userId, commentId],
         Vote,
         { isArray: false }
      );
   }

   async delete(userId: User['id'], commentId: Comment['id']): Promise<Vote | null> {
      return await this.commentVotes.query(
         `DELETE FROM votes WHERE user_id = $1 AND comment_id = $2 RETURNING *`,
         [userId, commentId],
         Vote,
         { isArray: false }
      );
   }
}
