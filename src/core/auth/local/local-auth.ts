import { IEncryptHash } from "@/core/ports/encrypt/IEncryptHash";
import { User } from "@/core/domain/user/entities/user.entity";
import { UserService } from "@/core/domain/user/service/user.service";

export class LocalAuthenticator {
   constructor(
      private readonly userService: UserService,
      private readonly passwordHasher: IEncryptHash
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
   async authenticate(username: string, password: string): Promise<User | null> {
      const user = await this.userService.findUserByUsername(username);
      if (!user) return null;
      const isValid = await this.passwordHasher.compare(password, user.hashed_password);
      if (!isValid) return null;
      return user;
   }
}
