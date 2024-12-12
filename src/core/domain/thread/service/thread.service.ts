import { User } from "@/core/domain/user/entities/user.entity.js";
import type { CreateThreadDto } from "@/core/domain/thread/dto/create-thread.dto.js";
import type { UpdateThreadDto } from "@/core/domain/thread/dto/update-thread.dto.js";
import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface.js";
import { Thread } from "@/core/domain/thread/entities/thread.entity.js";
import { inject, injectable } from "inversify";
import { ISqlDatabaseConnectionBinder } from "@/core/ports/database/single-connection-database/ISqlDatabaseConnectionBinder";
import { Comment } from "@/core/domain/comment/entities/comment.entity";

@injectable()
export class ThreadService {
   constructor(
      @inject(ISqlDatabase) private readonly database: ISqlDatabase,
      @inject(ISqlDatabaseConnectionBinder) private readonly connectionBinder: ISqlDatabaseConnectionBinder
   ) { }

   async create(createThreadDto: CreateThreadDto & { author_id: User['id']}): Promise<{ thread: Thread, comment: Comment }> {
      const connection = await this.connectionBinder.connect();

      try {
         await connection.query('BEGIN;');

         const thread = await connection.query(
            `INSERT INTO threads (title, author_id, category_id) VALUES ($1, $2, $3) RETURNING *`,
            [createThreadDto.title, createThreadDto.author_id, createThreadDto.category_id],
            Thread,
            { isArray: false }
         );

         const comment = await connection.query(
            `INSERT INTO comments (content, thread_id, author_id) VALUES ($1, $2, $3) RETURNING *`,
            [createThreadDto.initial_comment, thread!.id, createThreadDto.author_id],
            Comment,
            { isArray: false }
         );

         await connection.query('COMMIT;');

         const newThread = await connection.query(
            `SELECT * FROM threads WHERE id = $1`, 
            [thread!.id],
            Thread,
            { isArray: false }
         );

         const newComment = await connection.query(
            `SELECT * FROM comments WHERE id = $1`, 
            [comment!.id],
            Comment,
            { isArray: false }
         );

         return { thread: newThread!, comment: newComment! }
      } catch (error) {
         await connection.query('ROLLBACK;');
         throw error;
      } finally {
         await connection.release();
      }
   }

   async findAll() {
      return this.database.query(`SELECT * FROM threads`, [], Thread, { isArray: true });
   }
   async findAllByAuthorId(userId: User['id']) {
      return this.database.query(`SELECT * FROM threads WHERE author_id = $1`, [userId], Thread, { isArray: true });
   }
   async findAllByCategoryId(categoryId: Thread['category_id']) {
      return this.database.query(`SELECT * FROM threads WHERE category_id = $1`, [categoryId], Thread, { isArray: true });
   }

   async findOne(id: Thread['id']) {
      return this.database.query(`SELECT * FROM threads WHERE id = $1`, [id], Thread, { isArray: false });
   }

   async update(id: Thread['id'], updateThreadDto: UpdateThreadDto) {
      const input = { // need this fsr
         title: updateThreadDto.title,
         category_id: updateThreadDto.category_id
      }
      return this.database.query(`UPDATE threads SET ${Object.keys(input).map((key, index) => `${key} = $${index + 2}`).join(', ')} WHERE id = $1 RETURNING *`, [id, ...Object.values(input)], Thread, { isArray: false });
   }
}

