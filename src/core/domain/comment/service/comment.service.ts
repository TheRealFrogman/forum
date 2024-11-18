import { ISqlDatabase } from "@/core/ports/database/sql-database.interface.js";
import type { CreateCommentDto } from "@/core/domain/comment/dto/create-comment.dto.ts";
import type { UpdateCommentDto } from "@/core/domain/comment/dto/update-comment.dto.ts";
import { Comment } from "@/core/domain/comment/entities/comment.entity";

export class CommentService {
   constructor(
      private comments: ISqlDatabase,
   ) { }
   async create(createCommentDto: CreateCommentDto): Promise<Comment> {
      return (await this.comments.query(
         `INSERT INTO comments (content, thread_id, author_id) VALUES ($1, $2, $3) RETURNING *`,
         [createCommentDto.content, createCommentDto.thread_id, createCommentDto.author_id],
         Comment,
         { isArray: false }
      ))!;
   }

   async findAllByThread(threadId: string): Promise<Comment[]> {
      return await this.comments.query(
         `SELECT * FROM comments WHERE thread_id = $1`,
         [threadId],
         Comment,
         { isArray: true }
      );
   }

   async findOne(id: Comment['id']): Promise<Comment | null> {
      return await this.comments.query(
         `SELECT * FROM comments WHERE id = $1`,
         [id],
         Comment,
         { isArray: false }
      );
   }

   async update(id: Comment['id'], updateCommentDto: UpdateCommentDto): Promise<Comment | null> {
      const input = {
         content: updateCommentDto.content
      };
      return await this.comments.query(
         `UPDATE comments SET ${Object.keys(input).map((key, index) => `${key} = $${index + 2}`).join(', ')} WHERE id = $1 RETURNING *`,
         [id, ...Object.values(input)],
         Comment,
         { isArray: false }
      );
   }

   async delete(id: Comment['id']): Promise<Comment | null> {
      return await this.comments.query(
         `DELETE FROM comments WHERE id = $1 RETURNING *`,
         [id],
         Comment,
         { isArray: false }
      );
   }
   
}
