/**
 * interface for emailer service
 * @interface IEmailer
 * @returns {Promise<boolean>} true if email sent, false otherwise
 */
export abstract class IEmailer {
   abstract sendEmail(from: string,to: string, subject: string, message: string): Promise<boolean>;
}