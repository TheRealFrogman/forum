
export class UpdateThreadDto {
   description?: string
   title?: string
   constructor(data: UpdateThreadDto) {
      Object.assign(this, data);
   }
}
