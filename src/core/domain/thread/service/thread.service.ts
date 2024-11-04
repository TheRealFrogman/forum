import { User } from "../../user/entities/user.entity.js";
import type { CreateThreadDto } from "../dto/create-thread.dto.js";
import type { UpdateThreadDto } from "../dto/update-thread.dto.js";
import { ISqlDatabase } from "@/core/ports/database/sql-database.interface.js";
import { Thread } from "../entities/thread.entity.js";

export class ThreadService {
   constructor(
      private readonly database: ISqlDatabase
   ) { }

   async create(createThreadDto: CreateThreadDto) {
      return this.database.query(`INSERT INTO threads (title, description, author_id) VALUES ($1, $2, $3) RETURNING *`, [createThreadDto.title, createThreadDto.description, createThreadDto.author_id], Thread,);
   }

   async findAll() {
      return this.database.query(`SELECT * FROM threads`, [], Thread,);
   }
   async findAllByUserId(userId: User['id']) {
      return this.database.query(`SELECT * FROM threads WHERE author_id = $1`, [userId], Thread,);
   }

   async findOne(id: number) {
      return this.database.query(`SELECT * FROM threads WHERE id = $1`, [id], Thread,);
   }

   async update(id: number, updateThreadDto: UpdateThreadDto) {
      const input = {
         title: updateThreadDto.title,
         description: updateThreadDto.description,
      }
      return this.database.query(`UPDATE threads SET ${Object.keys(input).map((key, index) => `${key} = $${index + 2}`).join(', ')} WHERE id = $1 RETURNING *`, [id, ...Object.values(input)], Thread,);
   }
}

