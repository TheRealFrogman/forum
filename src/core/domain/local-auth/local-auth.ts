import { IEncryptHash } from "@/core/ports/hash-encrypt/IEncryptHash";
import { User } from "@/core/domain/user/entities/user.entity";
import { ISqlDatabase } from "@/core/ports/sql-database/sql-database.interface";
import { inject, injectable } from "inversify";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/create-user.dto";

@injectable()
export class LocalAuthenticatorService {
   constructor(
      @inject(IEncryptHash) private readonly passwordHasher: IEncryptHash,
      @inject(ISqlDatabase) private readonly database: ISqlDatabase,
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
   async register({ password, username }: RegisterDto): Promise<User | null> {
      const user = await this.database.query(`SELECT * FROM users WHERE username = $1`, [username], User, { isArray: false });
      if (user)
         return null;

      const hashed_password = await this.passwordHasher.hash(password);

      const dbresult = await this.database.query(`INSERT INTO users (hashed_password, username) VALUES ($1, $2) RETURNING *`, [hashed_password, username], User, { isArray: false });

      return dbresult!;
   }
}
