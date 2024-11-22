import { User } from "@/core/domain/user/entities/user.entity.js";
import type { CreateThreadDto } from "@/core/domain/thread/dto/create-thread.dto.js";
import type { UpdateThreadDto } from "@/core/domain/thread/dto/update-thread.dto.js";
import { ISqlDatabase } from "@/core/ports/sql-database/sql-database.interface.js";
import { Thread } from "@/core/domain/thread/entities/thread.entity.js";
import { inject, injectable } from "inversify";

@injectable()
export class ThreadService {
   constructor(
      @inject(ISqlDatabase) private readonly database: ISqlDatabase
   ) { }

   async create(createThreadDto: CreateThreadDto) {
      return (await this.database.query(
         `INSERT INTO threads (title, description, author_id) VALUES ($1, $2, $3) RETURNING *`,
         [createThreadDto.title, createThreadDto.description, createThreadDto.author_id],
         Thread, { isArray: false }
      ))!;
   }

   async findAll() {
      return this.database.query(`SELECT * FROM threads`, [], Thread, { isArray: true });
   }
   async findAllByUserId(userId: User['id']) {
      return this.database.query(`SELECT * FROM threads WHERE author_id = $1`, [userId], Thread, { isArray: true });
   }

   async findOne(id: Thread['id']) {
      return this.database.query(`SELECT * FROM threads WHERE id = $1`, [id], Thread, { isArray: false });
   }

   async update(id: Thread['id'], updateThreadDto: UpdateThreadDto) {
      const input = {
         title: updateThreadDto.title,
         description: updateThreadDto.description,
      }
      return this.database.query(`UPDATE threads SET ${Object.keys(input).map((key, index) => `${key} = $${index + 2}`).join(', ')} WHERE id = $1 RETURNING *`, [id, ...Object.values(input)], Thread, { isArray: false });
   }
}

