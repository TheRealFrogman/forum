import { User } from "../../user/entities/user.entity";
import { CreateThreadDto } from "../dto/create-thread.dto";
import { UpdateThreadDto } from "../dto/update-thread.dto";
import { Thread } from "../entities/thread.entity";

export interface IThreadRepository {
   findOne(id: number): Promise<Thread | null>;
   findAll(): Promise<Thread[]>;
   findAllByUserId(userId: User['id']): Promise<Thread[]>;
   create(data: CreateThreadDto): Promise<Thread>;
   update(id: number, data: UpdateThreadDto): Promise<Thread | null>;
}