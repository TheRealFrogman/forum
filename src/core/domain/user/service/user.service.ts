import { ISqlDatabase } from "@/core/ports/database/sql-database/sql-database.interface.js";
import { IEncryptHash } from "@/core/ports/hash-encrypt/IEncryptHash.js";
import type { UpdateUserDto } from "@/core/domain/user/dto/update-user.dto.js";
import { User } from "@/core/domain/user/entities/user.entity.js";
import { inject } from "inversify";

export class UserService {
   constructor(
      @inject(IEncryptHash) private readonly passwordHasher: IEncryptHash,
      @inject(ISqlDatabase) private readonly database: ISqlDatabase
   ) { }

   async findUserByUsername(username: string): Promise<User | null> {
      return await this.database.query(`SELECT * FROM users WHERE username = $1`, [username], User, { isArray: false });
   }
   async findUserByEmail(email: string): Promise<User | null> {
      return await this.database.query(`SELECT * FROM users WHERE email = $1`, [email], User, { isArray: false });
   }

   async findOneById(id: User['id']): Promise<User | null> {
      return await this.database.query(`SELECT * FROM users WHERE id = $1`, [id], User, { isArray: false });
   }

   async update(id: User['id'], updateUserDto: UpdateUserDto): Promise<User | null> {
      console.log(updateUserDto)
      const input = {
         hashed_password: updateUserDto.password ? await this.passwordHasher.hash(updateUserDto.password) : undefined,
         username: updateUserDto.username
      }
      for (const key in input) {
         //@ts-ignore
         if (input[key] === undefined) delete input[key];
      }

      const result = await this.database.query(`UPDATE users SET ${Object.keys(input).map((key, index) => `${key} = $${index + 2}`).join(', ')} WHERE id = $1 RETURNING *`, [id, ...Object.values(input)], User, { isArray: false });

      return result;
   }

   async delete(user: User): Promise<User | null> {
      const result = await this.database.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [user.id], User, { isArray: false });
      return result;
   }
}
