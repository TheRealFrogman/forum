import { ISqlDatabase } from "@/core/ports/database/sql-database.interface.js";
import type { CreatePhotoDto } from "@/core/domain/photo/dto/create-photo.dto.js";
import { Photo } from "@/core/domain/photo/entities/photo.entity.js";

export class PhotoService {
   constructor(
      private readonly database: ISqlDatabase
   ) { }

   async create(createPhotoDto: CreatePhotoDto) {
      return this.database.query(
         `INSERT INTO photos (link, target_type, target_id) VALUES ($1, $2, $3) RETURNING *`,
         [createPhotoDto.link, createPhotoDto.target_type, createPhotoDto.target_id],
         Photo,
      );
   }

   async findOne(id: number) {
      return this.database.query(
         `SELECT * FROM photos WHERE id = $1`,
         [id],
         Photo,
      );
   }
}