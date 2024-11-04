export class CreateThreadDto {
   constructor(
      public author_id: string,
      public description: string,
      public title: string,
   ) { }
}
