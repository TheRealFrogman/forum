import { IEmailer } from "@/core/ports/emailer/IEmailer";

export class Emailer implements IEmailer {
   async sendEmail(from: string, to: string, subject: string, message: string): Promise<boolean> {
      throw new Error("Method not implemented.");
   }
}