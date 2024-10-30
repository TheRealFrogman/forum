export class CreateThreadDto  {
   description!: string
   title!: string

   constructor(data: CreateThreadDto) {
      Object.assign(this, data);
   }
 }
