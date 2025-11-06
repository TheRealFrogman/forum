import { IEncryptHash } from "@/core/ports/hash-encrypt/IEncryptHash";
import { User } from "@/core/domain/user/entities/user.entity";
import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface";
import { inject, injectable } from "inversify";
import { LoginDto } from "./dto/login.dto";
// import { RegisterDto } from "./dto/register.dto";
// import { IEmailer } from "@/core/ports/emailer/IEmailer";
// import { ConfirmEmailJwtService } from "@/core/ports/jwt/service/ConfirmEmailJwtService";

@injectable()
export class LocalAuthenticatorService {
   constructor(
      @inject(IEncryptHash) private readonly passwordHasher: IEncryptHash,
      @inject(ISqlDatabase) private readonly database: ISqlDatabase,
      // @inject(IEmailer) private readonly emailer: IEmailer,
      // @inject(ConfirmEmailJwtService) private readonly confirmEmailJwtService: ConfirmEmailJwtService
   ) { }
   /**
    * Authenticate user by given username and password.
    *
    * @param {string} username
    * @param {string} password
    * @return {Promise<User | null>} 
    * Returns `User` if the user is authenticated successfully.
    * Returns `null` if the user is not found or the password is incorrect.
    */
   async authenticate({ password, username }: LoginDto): Promise<User | null> {
      const user = await this.database.query(`SELECT * FROM users WHERE username = $1`, [username], User, { isArray: false });
      if (!user)
         return null;

      const isValid = await this.passwordHasher.compare(password, user.hashed_password);
      if (!isValid)
         return null;

      return user;
   }

   /**
    * Register a new user with the given username and password.
    *
    * @param {string} username
    * @param {string} password
    * @return {Promise<User | null>} 
    * Returns `User` if the registration is successful.
    * Returns null if exists
    */
   // async register({ password, username, email }: RegisterDto): Promise<User> {
   //    const user = await this.database.query(`SELECT * FROM users WHERE username = $1`, [username], User, { isArray: false });
   //    if (user)
   //       throw new Error("User already exists");

   //    const hashed_password = await this.passwordHasher.hash(password);

   //    const dbresult = await this.database.query(`INSERT INTO users (hashed_password, username, email) VALUES ($1, $2, $3) RETURNING *`, [hashed_password, username, email], User, { isArray: false });

   //    return dbresult!;
   // }

   // async confirmEmail(user: User): Promise<User> {
   //    const result = await this.database.query(`UPDATE users SET email_confirmed = $1 WHERE id = $2 RETURNING *`, [true, user.id], User, { isArray: false });
   //    return result!;
   // }

   /**
    * Sends a confirmation email to the user
    *
    * @param {User} user
    * @return {Promise<boolean>} true if the email was sent, false otherwise
    */
   // async sendConfirmationEmail(user: User) {
   //    const isSent = await this.emailer.sendEmail(process.env["APP_EMAIL"]!, user.email, "Confirm your email", `Click <a href="${await this.createLink(user)}">here</a> to confirm your email.`);
   //    return isSent;
   // }
   // private async createLink(user: User) {
   //    return `http://localhost:3000/auth/confirm-email?token=${await this.confirmEmailJwtService.sign({ userId: user.id })}`
   // }
}
