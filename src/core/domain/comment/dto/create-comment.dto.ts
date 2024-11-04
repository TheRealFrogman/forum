export class CreateCommentDto {
   constructor(
      public id: number,
      public content: string,
      public thread_id: number,
      public author_id: number,
   ) { }
}
