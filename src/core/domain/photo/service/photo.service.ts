import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface.js";
import type { CreatePhotoDto } from "@/core/domain/photo/dto/create-photo.dto.js";
import { Photo } from "@/core/domain/photo/entities/photo.entity.js";
import { Thread } from "../../thread/entities/thread.entity";
import { inject, injectable } from "inversify";

@injectable()
export class PhotoService {
   constructor(
      @inject(ISqlDatabase) private readonly database: ISqlDatabase
   ) { }

   async create(createPhotoDto: CreatePhotoDto) {
      return this.database.query(
         `INSERT INTO photos (link, target_type, target_id) VALUES ($1, $2, $3) RETURNING *`,
         [createPhotoDto.link, createPhotoDto.target_type, createPhotoDto.target_id],
         Photo,
         { isArray: false }
      );
   }

   async findOne(id: number) {
      return this.database.query(
         `SELECT * FROM photos WHERE id = $1`,
         [id],
         Photo,
         { isArray: false },
      );
   }


   async getMainPhotosForThread(threadId: Thread['id']) {
      return this.database.query(
         `SELECT * FROM photos WHERE target_type = 'thread' AND target_id = $1`,
         [threadId],
         Photo,
         { isArray: true },
      );
   }
}