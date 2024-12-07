import { User } from "@/core/domain/user/entities/user.entity.js";
import type { CreateThreadDto } from "@/core/domain/thread/dto/create-thread.dto.js";
import type { UpdateThreadDto } from "@/core/domain/thread/dto/update-thread.dto.js";
import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface.js";
import { Thread } from "@/core/domain/thread/entities/thread.entity.js";
import { inject, injectable } from "inversify";

@injectable()
export class ThreadService {
   constructor(
      @inject(ISqlDatabase) private readonly database: ISqlDatabase
   ) { }

   async create(createThreadDto: CreateThreadDto) {
      return (await this.database.query(
         `INSERT INTO threads (title, description, author_id, category_id) VALUES ($1, $2, $3, $4) RETURNING *`,
         [createThreadDto.title, createThreadDto.description, createThreadDto.author_id, createThreadDto.category_id],
         Thread, { isArray: false }
      ))!;
   }

   async findAll() {
      return this.database.query(`SELECT * FROM threads_with_comments`, [], Thread, { isArray: true });
   }
   async findAllByUserId(userId: User['id']) {
      return this.database.query(`SELECT * FROM threads_with_comments WHERE author_id = $1`, [userId], Thread, { isArray: true });
   }
   async findAllByCategoryId(categoryId: Thread['category_id']) {
      return this.database.query(`SELECT * FROM threads_with_comments WHERE category_id = $1`, [categoryId], Thread, { isArray: true });
   }

   async findOne(id: Thread['id']) {
      return this.database.query(`SELECT * FROM threads_with_comments WHERE id = $1`, [id], Thread, { isArray: false });
   }

   async update(id: Thread['id'], updateThreadDto: UpdateThreadDto) {
      const input = { // need this fsr
         title: updateThreadDto.title,
         description: updateThreadDto.description,
         category_id: updateThreadDto.category_id
      }
      return this.database.query(`UPDATE threads SET ${Object.keys(input).map((key, index) => `${key} = $${index + 2}`).join(', ')} WHERE id = $1 RETURNING *`, [id, ...Object.values(input)], Thread, { isArray: false });
   }
}

