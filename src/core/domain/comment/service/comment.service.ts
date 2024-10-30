import type { CreateCommentDto } from "../dto/create-comment.dto.ts";
import type { UpdateCommentDto } from "../dto/update-comment.dto.ts";
import { ICommentRepository } from "../repository/ICommentRepository.interface.js";

export class CommentService {
   constructor(
      private comments: ICommentRepository,
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
