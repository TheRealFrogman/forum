export class CreatePhotoDto {
   link!: string;
   target_type!: 'thread' | 'comment';
   target_id!: number;
}
