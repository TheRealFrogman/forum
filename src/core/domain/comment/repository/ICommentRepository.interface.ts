import { CreateCommentDto } from "../dto/create-comment.dto";
import { UpdateCommentDto } from "../dto/update-comment.dto";

export interface ICommentRepository {
   findOne(id: number): Promise<Comment | null>;
   findAllByThread(): Promise<Comment[]>;
   create(data: CreateCommentDto): Promise<Comment>;
   update(id: number, data: UpdateCommentDto): Promise<Comment | null>;
   remove(id: number): Promise<void>;
}