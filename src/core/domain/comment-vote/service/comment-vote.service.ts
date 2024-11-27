import { ISqlDatabase } from "@/core/ports/sql-database/sql-database.interface";
import { inject } from "inversify";
import { NewCommentVoteDto } from "@/core/domain/comment-vote/dto/new-comment-vote.dto";
import { CommentVote } from "@/core/domain/comment-vote/entities/comment-vote.entity";
import { Comment } from "@/core/domain/comment/entities/comment.entity";

export class CommentVoteService {
   constructor(
      @inject(ISqlDatabase) private commentVotes: ISqlDatabase,
   ) { }
   async create(createCommentVoteDto: NewCommentVoteDto): Promise<CommentVote> {
      const result = await this.commentVotes.query(
         `INSERT INTO comment_votes (comment_id, user_id, vote_type) VALUES ($1, $2, $3) RETURNING *`,
         [createCommentVoteDto.comment_id, createCommentVoteDto.user_id, createCommentVoteDto.vote_type],
         CommentVote,
         { isArray: false }
      );
      return result!;
   }

   async findAllByComment(commentId: Comment['id']): Promise<CommentVote[]> {
      return await this.commentVotes.query(
         `SELECT * FROM comment_votes WHERE comment_id = $1`,
         [commentId],
         CommentVote,
         { isArray: true }
      );
   }

   async findOne(id: CommentVote['id']): Promise<CommentVote | null> {
      return await this.commentVotes.query(
         `SELECT * FROM comment_votes WHERE id = $1`,
         [id],
         CommentVote,
         { isArray: false }
      );
   }

   async delete(id: CommentVote['id']): Promise<CommentVote | null> {
      return await this.commentVotes.query(
         `DELETE FROM comment_votes WHERE id = $1 RETURNING *`,
         [id],
         CommentVote,
         { isArray: false }
      );
   }
}
