export class CreatePhotoDto {
   constructor(
      public link: string,
      public target_type: 'thread' | 'comment',
      public target_id: number,
   ) { }
}
