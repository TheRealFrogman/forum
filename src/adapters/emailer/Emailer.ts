import { IEmailer } from "@/core/ports/emailer/IEmailer";
import { createTestAccount, getTestMessageUrl, createTransport, } from 'nodemailer'

export class Emailer implements IEmailer {
   constructor() {
      this.transporter = createTransport({
         host: 'smtp.ethereal.email',
         port: 587,
         auth: {
             user: 'sheridan9@ethereal.email',
             pass: 'P8GrwaKNm8Zt1DtB9B'
         }
     });
   }
   private transporter;
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