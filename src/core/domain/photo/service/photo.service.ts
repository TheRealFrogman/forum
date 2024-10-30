import type { CreatePhotoDto } from "../dto/create-photo.dto.js";

import { IPhotoRepository } from "../repository/IPhotoRepository.interface.js";

export class PhotoService {
   constructor(
      private photos: IPhotoRepository,
   ) { }

   create(createPhotoDto: CreatePhotoDto) {
      return this.photos.create(createPhotoDto);
   }

   findOne(id: number) {
      return this.photos.findOne(id);
   }
}