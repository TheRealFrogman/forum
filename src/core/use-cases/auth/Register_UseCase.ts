import { EndpointResult } from "@/core/routing/reused-code/routes";
import { UseCase } from "../UseCase";
import { inject, injectable } from "inversify";
import { RegisterDto } from "@/core/domain/local-auth/dto/register.dto";
import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface";
import { User } from "@/core/domain/user/entities/user.entity";
import { IEncryptHash } from "@/core/ports/hash-encrypt/IEncryptHash";
import { IEmailer } from "@/core/ports/emailer/IEmailer";
import { ConfirmEmailJwtService } from "@/core/ports/jwt/service/ConfirmEmailJwtService";

@injectable()
export class Register_UseCase extends UseCase {
   constructor(
      @inject(IEncryptHash) private readonly passwordHasher: IEncryptHash,
      @inject(ISqlDatabase) private readonly database: ISqlDatabase,
      @inject(IEmailer) private readonly emailer: IEmailer,
      @inject(ConfirmEmailJwtService) private readonly confirmEmailJwtService: ConfirmEmailJwtService,
   ) {
      super();
   }

   override async execute({ email, password, username }: RegisterDto): Promise<EndpointResult> {

      const userByUsername = await this.database.query(`SELECT * FROM users WHERE username = $1`, [username], User, { isArray: false });
      if (userByUsername)
         return { statusCode: 409, statusMessage: "Username already taken" };

      const userByEmail = await this.database.query(`SELECT * FROM users WHERE email = $1`, [email], User, { isArray: false });
      if (userByEmail)
         return { statusCode: 409, statusMessage: "Email already taken" };

      const hashed_password = await this.passwordHasher.hash(password);

      const user = (await this.database.query(`INSERT INTO users (hashed_password, username, email) VALUES ($1, $2, $3) RETURNING *`, [hashed_password, username, email], User, { isArray: false }))!;

      const isSent = await this.emailer.sendEmail(process.env["APP_EMAIL"]!, user.email, "Confirm your email", `Click <a href="${await this.createLink(user)}">here</a> to confirm your email.`);
      if (!isSent)
         return { statusCode: 500, statusMessage: "Email sending failed" };

      return { statusCode: 201, responseModel: user, statusMessage: "User created" }
   }
   private async createLink(user: User) {
      return `http://${process.env["HOSTNAME"]}/auth/confirm-email?token=${await this.confirmEmailJwtService.sign({ userId: user.id })}`
   }
}