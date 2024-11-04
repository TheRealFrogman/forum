import { ISqlDatabase } from "@/core/ports/database/sql-database.interface.js";
import type { CreateCommentDto } from "@/core/domain/comment/dto/create-comment.dto.ts";
import type { UpdateCommentDto } from "@/core/domain/comment/dto/update-comment.dto.ts";

export class CommentService {
   constructor(
      private comments: ISqlDatabase,
   ) { }
   create(createCommentDto: CreateCommentDto) {
      return 'This action adds a new comment';
   }

   findAllByThread() {
      return `This action returns all comment`;
   }

   findOne(id: number) {
      return `This action returns a #${id} comment`;
   }

   update(id: number, updateCommentDto: UpdateCommentDto) {
      return `This action updates a #${id} comment`;
   }

   remove(id: number) {
      return `This action removes a #${id} comment`;
   }
}
