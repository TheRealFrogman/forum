import { Photo } from "../entities/photo.entity";
import { CreatePhotoDto } from "../dto/create-photo.dto";

export interface IPhotoRepository {
   findOne(id: number): Promise<Photo | null>;
   create(createPhotoDto: CreatePhotoDto): Promise<Photo>;
}

