import { IEmailer } from "@/core/ports/emailer/IEmailer";
import { createTestAccount, getTestMessageUrl, createTransport, } from 'nodemailer'

export class Emailer implements IEmailer {
   private transporter;
   constructor(host: string, port: number, auth:{user:string, pass:string}) {
      this.transporter = createTransport({
         host,
         port,
         auth
     });
   }

   async sendEmail(from: string, to: string, subject: string, message: string): Promise<boolean> {
      try {
         const info = await new Promise((res, rej) => {
            this.transporter.sendMail({
               from,
               text: message,
               to,
               subject
            }, (err, info) => {
               if (err)
                  rej(err);
               else
                  res(info)
            })
         })
         return true
      } catch (error) {
         return false;
      }
   }
}