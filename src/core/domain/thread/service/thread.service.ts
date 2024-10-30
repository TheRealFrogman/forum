import { User } from "../../user/entities/user.entity.js";
import type { CreateThreadDto } from "../dto/create-thread.dto.js";
import type { UpdateThreadDto } from "../dto/update-thread.dto.js";
import { IThreadRepository } from "../repository/IThreadRepository.interface.js";

export class ThreadService {
   constructor(
      private threads: IThreadRepository,
   ) { }

   create(createThreadDto: CreateThreadDto) {
      return this.threads.create(createThreadDto);
   }

   findAll() {
      return this.threads.findAll();
   }
   findAllByUserId(userId: User['id']) {
      return this.threads.findAllByUserId(userId);
   }

   findOne(id: number) {
      return this.threads.findOne(id);
   }

   update(id: number, updateThreadDto: UpdateThreadDto) {
      return this.threads.update(id, updateThreadDto);
   }
}

