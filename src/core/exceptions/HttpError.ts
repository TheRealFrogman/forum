export class HttpError extends Error {
   public httpCode: number
   /**
    * @param httpCode - http code of error
    * @param msg - error message
    */
   constructor(httpCode: number, msg?: string, name: string = "HttpError") {
      super(msg);
      this.name = name;
      this.httpCode = httpCode;
   }
   toJSON() {
      return {
         httpCode: this.httpCode,
         message: this.message,
         name: this.name
      }
   }
}